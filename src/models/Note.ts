import { observable } from 'mobx';
export class Note {
  id: string;
  @observable title: string;
  parentId: string;
  notes: Array<Note> = [];

  constructor(doc) {
    this.id = doc.id;
    const data = doc.data();
    this.title = data.title;
    this.parentId = data.parentId;
  }

  set(data: Partial<Note>) {
    for (const key in data) {
      console.log(key, '>', data[key]);
      this[key] = data[key];
    }
  }
}
