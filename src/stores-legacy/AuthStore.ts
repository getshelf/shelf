import api from 'src/api/';
import { types, flow, applySnapshot } from 'mobx-state-tree';

export const User = types.model({
  uid: types.string
});

export const AuthStore = types
  .model({
    isAuthenticated: types.boolean,
    user: types.maybe(User)
  })
  .actions(self => ({
    update: user => {
      self.user = {
        uid: user.uid
      };
      self.isAuthenticated = true;
    }
  }))
  .actions(self => ({
    signIn: flow(function* signIn() {
      try {
        const user = yield api.signIn();
        self.update(user);
      } catch (e) {
        console.error(e);
      }
    })
  }));

export const initState = {
  isAuthenticated: false,
  user: undefined
};
