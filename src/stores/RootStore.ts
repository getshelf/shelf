import { UserStore } from '@stores/UserStore';
import { NotesStore } from '@stores/NotesStore';
import { createContext } from 'react';

export class RootStore {
  userStore: UserStore;
  notesStore: NotesStore;
  
  constructor() {
    this.userStore = new UserStore(this);
    this.notesStore = new NotesStore(this);
  }
}

const rootStore = new RootStore();

export const RootStoreContext = createContext(rootStore);