import React, { useCallback } from "react";
import { Async } from "react-async";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { LoginPage } from ".";
import { useUserIdentity } from "../auth/context";
import { getCurrentUser } from "../firebase";
import { useQueryStringParam } from "../hooks/useQueryStringParam";

export const AttemptLoginPage: React.FC = () => {
  const { user } = useUserIdentity();
  const sessionId = useQueryStringParam("sessionId");

  const checkLogin = useCallback(async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("No user identity");
    }
  }, []);

  if (user) {
    return <Redirect to={sessionId ? `/sessions/${sessionId}` : `/start`} />;
  }

  return (
    <Wrapper>
      <Async promiseFn={checkLogin}>
        <Async.Rejected>
          <LoginPage />
        </Async.Rejected>
        <Async.Resolved>
          <Redirect to="/start" />
        </Async.Resolved>
      </Async>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 460px;
  padding-top: 100px;
  padding-bottom: 100px;
`;
