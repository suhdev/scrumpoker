import {
  ControlGroup,
  InputGroup,
  Button,
  ResizeSensor,
} from "@blueprintjs/core";
import cuid from "cuid";
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useUserIdentity } from "../auth/context";
import { createNewSession } from "../firebase";
import { useResize } from "../hooks/useResize";

export const CreateNewSession: React.FC<{}> = () => {
  const { width, onResize } = useResize();
  const { user } = useUserIdentity();
  const [name, setName] = useState("");
  const history = useHistory();

  const onClick = useCallback(async () => {
    const id = cuid();
    const sessionUser = {
      email: user!.email,
      fullname: user!.fullname,
      id: user!.id,
      permissions: {
        isOwner: true,
      },
    };
    createNewSession(id, name, sessionUser);
    history.push(`/sessions/${id}`);
  }, [history, name, user]);

  return (
    <ResizeSensor onResize={onResize}>
      <div>
        <div>Enter the new session's name below:</div>
        <br />
        <ControlGroup fill={true} vertical={width < 400}>
          <InputGroup
            placeholder="Session name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button icon="plus" onClick={onClick}>
            Create new session
          </Button>
        </ControlGroup>
      </div>
    </ResizeSensor>
  );
};
