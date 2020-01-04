import { observable, action, computed } from "mobx";
import { RootStore } from "./RootStore";
import api from "@api/index";
import { User } from "firebase";

export class UserStore {
  rootStore: RootStore;
  
  @observable user?: User;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action
  signIn = async () => {
    const user = await api.signIn();
    this.user = user;

    return user;
  }

  get userId(): string | null {
    return this.user ? this.user.uid : null;
  }

  @computed
  get isAuthenticated(): boolean {
    return Boolean(this.user);
  }
}