import { Api } from '.';

const DEFAULT_TITLE = 'New note';

export class Notes {
  api: Api;

  constructor(api) {
    this.api = api;
  }

  fetchNotes = async (
    parentId: NoteId,
    userId: string,
    onSnapshot: SnapshotListener
  ) => {
    const result = this.api.db
      .collection('notes')
      .where('parentId', '==', parentId)
      .where('authorId', '==', userId)
      .onSnapshot(onSnapshot);

    return result;
  };

  createNote = async (parentId: NoteId = false, authorId: string) => {
    const ref = await this.api.db.collection('notes').add({
      title: DEFAULT_TITLE,
      authorId,
      parentId
    });

    this.updateDocument(ref.id);
  };

  updateDocument = async (noteId: string, content: string = '') => {
    return this.api.storage
      .ref()
      .child(`notes/${noteId}/document`)
      .put(new Blob([content], { type: 'text/plain' }))
  };

  fetchDocument = async (noteId: string): Promise<string> => {
    const url = await this.api.storage
      .ref()
      .child(`notes/${noteId}/document`)
      .getDownloadURL()

    const response = await fetch(url);
    const blob = await response.blob();
    const fileReader = new FileReader();
    return new Promise(resolve => {
      fileReader.addEventListener('loadend', event => {
        const text = event.target!.result as string || '';
        resolve(text);
      })

      fileReader.readAsText(blob);
    })
  }
  
}
