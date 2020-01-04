import { types, flow } from 'mobx-state-tree';
import api from '@api/index';

export const NoteStore = types
  .model('NoteStore', {
    text: types.optional(types.string, ''),
    state: types.optional(types.enumeration('State', ['pending', 'done', 'error']), 'done')
  })
  .actions(self => {
    return {
      setText(text) {
        self.text = text;
      }
    }
  })
  .actions(self => {
    return {
      saveNote(noteId: string, content: string) {
        return api.storage
          .ref()
          .child(`notes/${noteId}`)
          .put(new Blob([content], {type: 'text/plain'}))
      },

      saveTitle(noteId: string, title: string) {
        return api.db
          .collection('notes')
          .doc(noteId)
          .set({ title }, { merge: true })
      },

      fetchNote: flow(function* fetchNote(noteId: string) {
        try {
          const url = yield api.storage
            .ref()
            .child(`notes/${noteId}`)
            .getDownloadURL()

          const response = yield fetch(url);
          const blob = yield response.blob();
          const fileReader = new FileReader();
          yield new Promise(resolve => {
            fileReader.addEventListener('loadend', event => {
              const text = event.target!.result as string || '';
              self.setText(text);
              console.log(text);
              resolve(text);
            })
            fileReader.readAsText(blob);
          });
          
          return;
        } catch (err) {
          self.state = 'error';
          self.setText('');
        }
      })
    }
  })