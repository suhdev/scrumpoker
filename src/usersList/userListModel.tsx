import { makeObservable, observable, action } from "mobx";
import { IUserIdentity } from "../auth/context";
import { db } from "../firebase";
import { toaster } from "../init";

export class UserListModel {
  users: IUserIdentity[] = [];

  constructor() {
    makeObservable(this, {
      users: observable.ref,
    });
  }

  @action.bound
  add(user: IUserIdentity, notify?: boolean) {
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
  update(user: IUserIdentity) {
    const idx = this.users.findIndex((u) => u.id === user.id);
    if (idx === -1) {
      this.add(user);
      return;
    }

    const users = this.users.slice(0);
    users[idx] = user;
    this.users = users;
  }

  setup(sessionId: string, user: IUserIdentity) {
    const ref = db.ref(`sessions`).child(sessionId).child(`users`);

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

    db.ref(`sessions`)
      .child(sessionId)
      .child(`users`)
      .child(`${user!.id}`)
      .set(user);

    return () => {
      ref.off("child_changed");
      ref.off("child_added");
      ref.off("child_removed");
    };
  }
}
