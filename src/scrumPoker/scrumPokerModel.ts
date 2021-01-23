import { action, computed, makeObservable, observable } from "mobx";
import { IUserIdentity } from "../auth/context";
import {
  db,
  getScrumPokerTicketInfoRef,
  getScrumPokerTicketRef,
  getScrumPokerTicketVotesRef,
  getSessionUsersRef,
} from "../firebase";
import { MAX_VOTE_TIME_IN_SECONDS } from "./constants";
import differenceInSeconds from "date-fns/differenceInSeconds";
import { toaster } from "../init";

export interface NoteItem {
  text: string;
  userId: string;
  type: "Continue" | "Stop" | "Start";
}

export interface ITicketInfo {
  text: string;
  code: string;
  started: boolean;
  expiryDate: number;
}

export interface IVote {
  userId: string;
  vote: number;
}

export class ScrumPokerModel {
  votes: { [idx: string]: number } = {};
  users: IUserIdentity[] = [];
  code: string = "";
  text: string = "";
  ticketRef: any;
  votesRef: any;
  currentTime: Date = new Date();
  expiryDate: Date = new Date();
  intervalId: any = -1;
  started: boolean = false;
  canStart: boolean = false;

  get userVotes() {
    return this.users.map((user) => ({
      ...user,
      vote: this.votes[user.id] || "No vote",
    }));
  }

  get timeLeft() {
    const left = differenceInSeconds(this.expiryDate, this.currentTime);
    return left > 0 ? left : 0;
  }

  get percentage() {
    return 1 - this.timeLeft / MAX_VOTE_TIME_IN_SECONDS;
  }

  get expired() {
    return this.currentTime.getDate() > this.expiryDate.getDate();
  }

  constructor() {
    makeObservable(this, {
      users: observable.ref,
      votes: observable.ref,
      started: observable,
      canStart: observable,
      expiryDate: observable,
      userVotes: computed,
      percentage: computed,
      currentTime: observable,
      timeLeft: computed,
      expired: computed,
      code: observable,
      text: observable,
    });
  }

  getVoteForUser(userId: string) {
    return this.votes[userId] || null;
  }

  @action.bound
  vote(userId: string, value: string) {
    this.votesRef.child(userId).set(+value);
    toaster.show(
      {
        message: "Your vote has been recorded",
        timeout: 2000,
        intent: "primary",
      },
      `${Date.now()}`
    );
  }

  resetTimer() {
    this.ticketRef
      .child("info")
      .child("expiryDate")
      .set(Date.now() + MAX_VOTE_TIME_IN_SECONDS * 1000);
  }

  start() {
    this.ticketRef.child("info").child("started").set(true);
    this.ticketRef.child("votes").remove();
    this.resetTimer();
    this.startTimer();
  }

  startTimer() {
    this.intervalId = setInterval(
      action(() => {
        this.currentTime = new Date();

        if (this.percentage > 1) {
          this.stopTimer();
        }
      }),
      1000
    );
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }

  setup(sessionId: string, ticketId: string, user: IUserIdentity) {
    const ref = getScrumPokerTicketRef(sessionId, ticketId);

    this.ticketRef = ref;

    const votesRef = getScrumPokerTicketVotesRef(sessionId, ticketId);
    this.votesRef = votesRef;
    votesRef.on(
      "value",
      action((snapshot) => {
        const val = snapshot.val();
        this.votes = val || {};
      })
    );

    const ticketInfoRef = getScrumPokerTicketInfoRef(sessionId, ticketId);

    ticketInfoRef.on(
      "value",
      action((snapshot) => {
        const val = snapshot.val() as ITicketInfo;
        if (val) {
          this.expiryDate = new Date(val.expiryDate);
          this.started = val.started || false;
          if (this.started && this.percentage < 1) {
            toaster.show(
              {
                message: `Voting on ${ticketId} has started`,
                intent: "warning",
                timeout: 3000,
              },
              `${Date.now()}`
            );
          }
          this.code = val.code;
          this.text = val.text;
          this.startTimer();
          return;
        }
      })
    );

    const usersRef = getSessionUsersRef(sessionId);

    const isOwnerRef = usersRef
      .child(user.id)
      .child("permissions")
      .child("isOwner");
    isOwnerRef.on(
      "value",
      action((snapshot) => {
        this.canStart = snapshot.val() || false;
      })
    );

    usersRef.on(
      "value",
      action((snapshot) => {
        const val = snapshot.val();
        this.users = val ? Object.values(val) : [];
      })
    );

    return () => {
      votesRef.off("value");
      ticketInfoRef.off("value");
      usersRef.off("value");
      isOwnerRef.off("value");
      this.stopTimer();
    };
  }
}

export class xScrumPokerModel {
  notes: NoteItem[] = [];
  get toStop() {
    return this.notes.filter((n) => n.type === "Stop");
  }

  get toContinue() {
    return this.notes.filter((n) => n.type === "Continue");
  }

  get toStart() {
    return this.notes.filter((n) => n.type === "Start");
  }

  constructor() {
    makeObservable(this, {
      notes: observable.ref,
      toStart: computed,
      toContinue: computed,
      toStop: computed,
    });
  }

  setup(sessionId: string, user: IUserIdentity) {
    db.ref("sessions").child(sessionId).child(`scrum`);
  }
}
