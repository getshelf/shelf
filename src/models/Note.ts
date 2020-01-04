export class Note {
  id: string;
  title: string;
  parentId: string;
  notes: Array<Note> = [];

  constructor(doc) {
    this.id = doc.id;
    const data = doc.data();
    this.title = data.title;
    this.parentId = data.parentId;
  }
}

// import { types, Instance, getParent } from 'mobx-state-tree';
// import api from 'src/api';
// import { INotesStore } from '@stores/NotesStore';

// export const Note = types
//   .model('Note', {
//     id: types.identifier,
//     title: types.string,
//     authorId: types.string,
//     parentId: types.union(types.string, types.boolean),
//     notes: types.array(types.reference(types.late(() => Note)))
//   })
//   .actions(self => ({
//     setNotes(noteIds) {
//       self.notes.replace(noteIds);
//     }
//   }))
//   .actions(self => {
//     let unsubscribe;
    
//     return {
//       async getNotes() {
//         if (unsubscribe) {
//           unsubscribe();
//         }
        
//         unsubscribe = api.db
//           .collection('notes')
//           .where('parentId', '==', self.id)
//           .where('authorId', '==', self.authorId)
//           .onSnapshot(snapshot => {
//             getParent<INotesStore>(self, 2).setNotes(snapshot.docs);
//             self.setNotes(snapshot.docs.map(doc => doc.id));
//           });
        
//       },
//       async setNotes(noteIds) {
//         self.notes = noteIds;
//       }
//     }
//   })

// export type INote = Instance<typeof Note>;