import { makeObservable, observable, action, runInAction } from "mobx";
import { IUserIdentity } from "../auth/context";
import { getSessionUserPermissionsRef, getSessionUsersRef } from "../firebase";
import { toaster } from "../init";

export interface ISessionUserIdentity extends IUserIdentity {
  permissions: {
    isOwner: boolean;
  };
}

export class UserListModel {
  users: ISessionUserIdentity[] = [];
  currentUser: IUserIdentity | null = null;

  constructor() {
    makeObservable(this, {
      users: observable.ref,
      currentUser: observable.ref,
    });
  }

  @action.bound
  add(user: ISessionUserIdentity, notify?: boolean) {
    if (!this.users.find((u) => u.id === user.id)) {
      this.users = [...this.users, user];

      notify &&
        toaster.show(
          {
            message: `New user joined ${user.fullname}`,
            timeout: 2000,
            intent: "primary",
          },
          user.id as string
        );
    }
  }

  @action.bound
  remove(userId: string) {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      toaster.show({
        message: `User left session ${this.users[idx].fullname}`,
        timeout: 2000,
        intent: "warning",
      });
      return;
    }
    const users = this.users.slice(0);
    users.splice(idx, 1);
    this.users = users;
  }

  @action.bound
  update(user: ISessionUserIdentity) {
    const idx = this.users.findIndex((u) => u.id === user.id);
    if (idx === -1) {
      this.add(user);
      return;
    }

    const users = this.users.slice(0);
    users[idx] = user;
    this.users = users;
  }

  async makeOwner(sessionId: string, userId: string) {
    await getSessionUserPermissionsRef(sessionId, userId)
      .child("isOwner")
      .set(true);
  }

  setup(sessionId: string, currentUser: IUserIdentity) {
    runInAction(() => {
      this.currentUser = currentUser;
    });
    const ref = getSessionUsersRef(sessionId);

    ref.on("child_added", (snapshot) => {
      const u = snapshot.val();
      this.add(u);
    });

    ref.on("child_removed", (snapshot) => {
      this.remove(snapshot.key as string);
    });

    ref.on("child_changed", (snapshot) => {
      this.update(snapshot.val());
    });

    ref.once("value", (snapshot) => {
      runInAction(() => {
        this.users = Object.values(snapshot.val() || {});
      });
    });

    return () => {
      ref.off("child_changed");
      ref.off("child_added");
      ref.off("child_removed");
    };
  }
}
