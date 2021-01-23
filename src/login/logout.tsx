import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useUserIdentity } from "../auth/context";
import { signOut } from "../firebase";

export const LogoutPage: React.FC = () => {
  const { user, setUser } = useUserIdentity();
  useEffect(() => {
    if (user) {
      signOut()
        .then(() => {
          setUser(null as any);
        })
        .catch(() => {});
    }
  }, [user, setUser]);

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <>Logging out </>;
};
