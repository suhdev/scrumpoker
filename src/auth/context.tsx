import React, { useCallback, useContext, useState } from "react";

export interface IUserIdentity {
  id: string;
  fullname: string;
  email: string;
}

const LAST_SESSION_ID = "LAST_SESSION_ID";
const SESSION_USER = "SESSION_USER";

const UserContext = React.createContext<{
  user: IUserIdentity | null;
  setUser: (user: IUserIdentity) => void;
}>({ user: null, setUser: () => {} });

export function useUserIdentity() {
  return useContext(UserContext);
}

export function getLastSessionId() {
  return sessionStorage.getItem(LAST_SESSION_ID);
}

export function setLastSessionId(sessionId: string) {
  sessionStorage.setItem(LAST_SESSION_ID, sessionId);
}

export function setSessionUser(user: IUserIdentity) {
  sessionStorage.setItem(SESSION_USER, JSON.stringify(user));
}

export function getSessionUser() {
  const r = sessionStorage.getItem(SESSION_USER) as string | null;
  if (r) {
    return JSON.parse(r);
  }
  return null;
}

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<IUserIdentity | null>(getSessionUser());

  const setUserCallback = useCallback(
    (user: IUserIdentity) => {
      setSessionUser(user);
      setUser(user);
    },
    [setUser]
  );

  return (
    <UserContext.Provider value={{ user, setUser: setUserCallback }}>
      {children}
    </UserContext.Provider>
  );
};
