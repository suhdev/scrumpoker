import {
  Button,
  ControlGroup,
  InputGroup,
  Label,
  ResizeSensor,
} from "@blueprintjs/core";
import React, { useState } from "react";
import styled from "styled-components";
import { useUserIdentity } from "../auth/context";
import md5 from "md5";
import { signIn } from "../firebase";
import { useResize } from "../hooks/useResize";
import { Logo } from "../assets/logo";
import { FlexSpaceAround } from "../helpers/align";

export function useQueryStringParam(key: string) {
  return new URLSearchParams(window.location.search.slice(1)).get(key);
}

export const LoginPage: React.FC = () => {
  const { width, onResize } = useResize();
  const { setUser } = useUserIdentity();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ResizeSensor onResize={onResize}>
      <Wrapper>
        <FlexSpaceAround direction="row">
          <Logo size={"xl"} />
          <h1>Scrum Miester</h1>
        </FlexSpaceAround>
        <br />
        <ControlGroup fill={true} vertical={width < 400}>
          <LeftLabel>Email Address</LeftLabel>
          <InputGroup
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </ControlGroup>
        {width < 400 ? <br /> : null}
        <ControlGroup fill={true} vertical={width < 400}>
          <LeftLabel>Password</LeftLabel>
          <InputGroup
            placeholder="Password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </ControlGroup>
        <br />
        <Button
          intent="primary"
          onClick={async () => {
            try {
              const user = await signIn(email, password);
              setUser({
                fullname: user.user!.displayName as string,
                email: user.user!.email as string,
                id: user.user!.uid,
              });
            } catch (err) {
              console.log(err);
            }
          }}
        >
          Sign in
        </Button>
      </Wrapper>
    </ResizeSensor>
  );
};

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 500px;
  padding-top: 100px;
  padding-bottom: 100px;
  padding-left: ${(p) => p.theme.spacing.md};
  padding-right: ${(p) => p.theme.spacing.md};
`;

const LeftLabel = styled(Label)`
  width: 100px;
`;

export function createUserId(email: string) {
  return md5(email.trim().toLowerCase());
}
