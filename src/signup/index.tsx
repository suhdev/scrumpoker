import { Button, ControlGroup, InputGroup, Label } from "@blueprintjs/core";
import React, { useState } from "react";
import styled from "styled-components";
import { Redirect, useHistory } from "react-router-dom";
import { useUserIdentity } from "../auth/context";
import md5 from "md5";
import { signUp } from "../firebase";
import { Logo } from "../assets/logo";
import { FlexSpaceAround, FlexSpaceBetween } from "../helpers/align";
import { useQueryStringParam } from "../hooks/useQueryStringParam";

export const SignUpPage: React.FC = () => {
  const { user, setUser } = useUserIdentity();
  const history = useHistory();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const queryStringSessionId = useQueryStringParam("sessionId");

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Wrapper>
      <FlexSpaceAround direction="row">
        <Logo size={"xl"} />
        <h1>Scrum Miester</h1>
      </FlexSpaceAround>
      <br />
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
      <ControlGroup fill={true} vertical={false}>
        <LeftLabel>Password</LeftLabel>
        <InputGroup
          placeholder="Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </ControlGroup>
      <br />
      <FlexSpaceBetween>
        <Button
          intent="primary"
          onClick={async () => {
            const user = await signUp(fullname, email, password);
            setUser({
              email: user.user!.email as string,
              fullname: user.user!.displayName as string,
              id: user.user!.uid,
            });
            history.push(`/start`);
          }}
        >
          Sign Up
        </Button>
        <Button
          intent="success"
          onClick={async () => {
            history.push(
              `/login${
                queryStringSessionId ? `?sessionId=${queryStringSessionId}` : ""
              }`
            );
          }}
        >
          Login
        </Button>
      </FlexSpaceBetween>
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

export function createUserId(email: string) {
  return md5(email.trim().toLowerCase());
}
