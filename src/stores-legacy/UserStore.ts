import { types } from 'mobx-state-tree';
import { Note } from 'src/models/Note';

export const UserStore = types.model({
  root: types.array(types.reference(Note))
})