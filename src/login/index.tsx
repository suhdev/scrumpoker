import {
  Button,
  ControlGroup,
  FormGroup,
  InputGroup,
  Label,
} from "@blueprintjs/core";
import React, { useState } from "react";
import styled from "styled-components";
import { Async } from "react-async";
import { Redirect, Route, useHistory } from "react-router-dom";
import { setLastSessionId, useUserIdentity } from "../auth/context";
import md5 from "md5";

export function useQueryStringParam(key: string) {
  return new URLSearchParams(window.location.search.slice(1)).get(key);
}

export const LoginPage: React.FC = () => {
  const { setUser, user } = useUserIdentity();
  const history = useHistory();
  const sessionId = useQueryStringParam("sessionId");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [session, setSessionId] = useState(sessionId || "");

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Wrapper>
      <ControlGroup fill={true} vertical={false}>
        <LeftLabel>Full Name</LeftLabel>
        <InputGroup
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
      </ControlGroup>
      <ControlGroup fill={true} vertical={false}>
        <LeftLabel>Email Address</LeftLabel>
        <InputGroup
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </ControlGroup>
      <br />
      <ControlGroup fill={true} vertical={false}>
        <InputGroup
          placeholder="Session id"
          value={session}
          onChange={(e) => setSessionId(e.target.value)}
        />
        <Button icon="plus">Create new</Button>
      </ControlGroup>
      <br />
      <Button
        onClick={() => {
          setLastSessionId(session);
          setUser({ email, fullname, id: md5(email.toLowerCase()) });

          history.push(`/sessions/${session}`);
        }}
      >
        Join
      </Button>
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

const LeftLabel = styled(Label)`
  width: 100px;
`;
