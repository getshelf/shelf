import { RootStore } from './RootStore';
import api from '@api/index';
import { Element } from 'shelf-editor';
import { Note } from '@models/Note';
import { observable, computed, action, runInAction } from 'mobx';

const defaultNote = [{ type: 'title', children: [{ text: 'New Note' }] }];

export class NotesStore {
  rootStore: RootStore;
  @observable subscriptions: Map<NoteId, () => void> = new Map();
  @observable notes: Map<NoteId, Note> = new Map();
  @observable root: Array<Note> = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  fetchNotes = async (parentId: NoteId = false) => {
    return new Promise(async resolve => {
      const prevUnsubscribe = this.subscriptions.get(parentId);

      if (prevUnsubscribe) {
        prevUnsubscribe();
      }

      const unsubscribe = await api.notes.fetchNotes(
        parentId,
        this.userId,
        snapshot => {
          const notes = snapshot.docs.map(doc => new Note(doc));

          runInAction(() => {
            notes.forEach(note => this.setNote(note));

            if (!parentId) {
              this.root = notes;
            } else {
              const parent = this.notes.get(parentId);
              if (parent) {
                parent.notes = notes;
              }
              resolve();
            }
          });
        }
      );

      this.subscriptions.set(parentId, unsubscribe);
    });
  };

  @action
  createNote = async (parentId: NoteId = false) => {
    return api.notes.createNote(parentId, this.userId);
  };

  updateDocument = async (noteId: string, content?: string) => {
    return api.notes.updateDocument(noteId, content);
  };

  updateMeta = async (noteId: string, partial: Partial<Note>) => {
    return api.db
      .collection('notes')
      .doc(noteId)
      .set(partial, { merge: true });
  }

  fetchDocument = async (noteId: string): Promise<Array<Element>> => {
    const data = await api.notes.fetchDocument(noteId);
    try {
      return JSON.parse(data);
    } catch (error) {
      return defaultNote;
    }
  };

  @action
  setNote = (note: Note) => {
    this.notes.set(note.id, note);
  };

  get userId(): string {
    const userId = this.rootStore.userStore.userId;
    if (userId) {
      return userId;
    }

    throw new Error('Unauthenticated');
  }
}
