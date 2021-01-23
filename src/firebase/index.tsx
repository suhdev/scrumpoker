import firebase from "firebase";
// import * as firebaseui from "firebaseui";
import { IUserIdentity } from "../auth/context";

const SCRUM_POKER_KEY = "scrumpoker";
const SESSION_KEY = "sessions";
const TICKETS_KEY = "tickets";
const TICKETS_VOTES_KEY = "votes";
const TICKETS_INFO_KEY = "info";
const SESSION_USERS_KEY = "users";
const SESSION_USERS_PERMISSIONS_KEY = "permissions";

const firebaseConfig = {
  apiKey: "AIzaSyC-jVBxuXwFgnFpF2l9vryfJTRSji4f2Ko",
  authDomain: "scrumpoker-beta.firebaseapp.com",
  databaseURL:
    "https://scrumpoker-beta-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "scrumpoker-beta",
  storageBucket: "scrumpoker-beta.appspot.com",
  messagingSenderId: "442065546523",
  appId: "1:442065546523:web:90c0ba98845f2c8254f7be",
  measurementId: "G-670Z678GBS",
};

const app = firebase.initializeApp(firebaseConfig);

export const db = app.database();

export function getSessionRef(sessionId: string) {
  return db.ref(SESSION_KEY).child(sessionId);
}

export function getScrumPokerRef(sessionId: string) {
  return getSessionRef(sessionId).child(SCRUM_POKER_KEY);
}

export function getScrumPokerTicketsRef(sessionid: string) {
  return getScrumPokerRef(sessionid).child(TICKETS_KEY);
}

export function getScrumPokerTicketRef(sessionId: string, ticketId: string) {
  return getScrumPokerRef(sessionId).child(TICKETS_KEY).child(ticketId);
}

export function getScrumPokerTicketVotesRef(
  sessionId: string,
  ticketId: string
) {
  return getScrumPokerTicketRef(sessionId, ticketId).child(TICKETS_VOTES_KEY);
}

export function getScrumPokerTicketInfoRef(
  sessionId: string,
  ticketId: string
) {
  return getScrumPokerTicketRef(sessionId, ticketId).child(TICKETS_INFO_KEY);
}

export function getSessionUsersRef(sessionId: string) {
  return getSessionRef(sessionId).child(SESSION_USERS_KEY);
}

export function getSessionUserRef(sessionId: string, userId: string) {
  return getSessionRef(sessionId).child(SESSION_USERS_KEY).child(userId);
}

export function getSessionUserPermissionsRef(
  sessionId: string,
  userId: string
) {
  return getSessionRef(sessionId)
    .child(SESSION_USERS_KEY)
    .child(userId)
    .child(SESSION_USERS_PERMISSIONS_KEY);
}

export async function joinExistingSession(
  sessionId: string,
  user: IUserIdentity
) {
  await getSessionUserRef(sessionId, user.id).set(user);
}

export async function createNewSession(
  sessionId: string,
  sessionName: string,
  user: IUserIdentity
) {
  await getSessionRef(sessionId).set({
    id: sessionId,
    name: sessionName,
    users: { [user.id]: user },
  });
}

export async function updateProfile(displayName: string) {
  await firebase.auth().currentUser?.updateProfile({
    displayName,
  });
}

// export const ui = new firebaseui.auth.AuthUI(firebase.auth());

// export function startLoginUi() {
//   ui.start("#firebase-auth", {
//     signInOptions: [
//       {
//         provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
//         signInMethod:
//           firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
//       },
//     ],
//   });
// }

export async function signIn(email: string, password: string) {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  return await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signUp(
  fullname: string,
  email: string,
  password: string
) {
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  const user = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
  await user.user?.updateProfile({
    displayName: fullname,
  });
  return user;
}

export async function signOut() {
  return await firebase.auth().signOut();
}

export function getCurrentUser() {
  return firebase.auth().currentUser;
}
