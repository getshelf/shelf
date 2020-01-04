import { types, flow, getRoot, applySnapshot, Instance } from 'mobx-state-tree';
import { Note, INote } from 'src/models/Note';
import api from '@api/index';
import { RootStore } from './RootStore';

type ParentId = string | boolean;
const DEFAULT_TITLE = 'New note';

export const NotesStore = types
  .model('NotesStore', {
    all: types.map(Note),
    root: types.array(types.reference(Note)),
    selected: types.maybe(types.reference(Note))
  })
  .views(self => {
    return {
      get selectedId() {
        return self.selected && self.selected.id;
      },
      get userId() {
        return getRoot<typeof RootStore>(self).auth.user.uid;
      }
    };
  })
  .actions(self => ({
    setNote(doc) {
      self.all.set(doc.id, {
        id: doc.id,
        ...doc.data()
      });
    }
  }))
  .actions(self => {
    return {
      setNotes(docs) {
        docs.forEach(self.setNote);
      },
      setRootNotes(noteIds) {
        self.root.replace(noteIds);
      }
    };
  })
  .actions(self => {
    const fetchRoot = (parentId: ParentId = false) => {
      api.db
        .collection('notes')
        .where('parentId', '==', parentId)
        .where('authorId', '==', self.userId)
        .onSnapshot(snapshot => {
          self.setNotes(snapshot.docs);
          self.setRootNotes(snapshot.docs.map(doc => doc.id));
        });
    };

    const addNote = flow(function* addNote(parentId: ParentId = false) {
      return api.db.collection('notes').add({
        title: DEFAULT_TITLE,
        authorId: self.userId,
        parentId
      })
    });

    const selectNote = (noteId: string) => {
      self.selected = noteId;
    };

    return {
      fetchRoot,
      addNote,
      selectNote
    };
  });

export type INotesStore = Instance<typeof NotesStore>;
