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
          const changes = snapshot.docChanges();

          runInAction(() => {
            const collection = parentId ? this.notes.get(parentId)!.notes : this.root;
            
            changes.forEach((change: firebase.firestore.DocumentChange) => {
              switch (change.type) {
                
                case 'added': {
                  const note = new Note(change.doc);
                  this.notes.set(note.id, note);
                  collection.push(note);
                  break;
                }

                case 'removed': {
                  // TODO
                }

                case 'modified': {
                  const note = this.notes.get(change.doc.id);
                  note?.set(change.doc.data())
                }
              }

              resolve();
            })
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

  get userId(): string {
    const userId = this.rootStore.userStore.userId;
    if (userId) {
      return userId;
    }

    throw new Error('Unauthenticated');
  }
}
