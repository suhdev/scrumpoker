import { action, makeObservable, observable } from "mobx";
import { db, getScrumPokerRef } from "../firebase";

interface ITicket {}

export class TicketListModel {
  tickets: ITicket[] = [];

  constructor() {
    makeObservable(this, {
      tickets: observable.ref,
    });
  }

  setup(sessionId: string) {
    const tickets = getScrumPokerRef(sessionId);

    tickets.on(
      "value",
      action((snapshot) => {
        this.tickets = Object.values(snapshot.val() || {});
      })
    );

    return () => {
      tickets.off("value");
    };
  }
}
