import { createContext } from 'react';
import { types, flow, Instance } from 'mobx-state-tree';
import makeInspectable from 'mobx-devtools-mst';

import { AuthStore, initState as authInitState } from './AuthStore';
import { UserStore } from './UserStore';
import { NotesStore } from './NotesStore';
import { NoteStore } from './NoteStore';

export const RootStore = types
  .model('RootStore', {
    auth: types.optional(AuthStore, authInitState),
    notes: types.optional(NotesStore, {}),
    user: types.optional(UserStore, {}),
    note: types.optional(NoteStore, {}),
  })
  .actions(self => ({
    afterCreate: flow(function* afterCreate() {
      yield self.auth.signIn();
      self.notes.fetchRoot();
    }) 
  }));

const rootStore = RootStore.create();
makeInspectable(rootStore);

export const RootStoreContext = createContext(rootStore);
export type IRootStore = Instance<typeof RootStore>;