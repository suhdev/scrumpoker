import {
  ControlGroup,
  InputGroup,
  Button,
  ResizeSensor,
} from "@blueprintjs/core";
import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useQueryStringParam } from "../hooks/useQueryStringParam";
import { useResize } from "../hooks/useResize";

export const JoinSession: React.FC = () => {
  const { width, onResize } = useResize();
  const sessionId = useQueryStringParam("sessionId");
  const [session, setSessionId] = useState(sessionId || "");
  const history = useHistory();

  const joinSession = useCallback(async () => {
    history.push(`/sessions/${session}`);
  }, [session, history]);

  const controlView = (
    <ControlGroup fill={true} vertical={width < 400}>
      <InputGroup
        placeholder="Session id"
        value={session}
        onChange={(e) => {
          if ((e.target.value || "").trim()) {
            setSessionId(e.target.value);
          }
        }}
      />
      <Button icon="chevron-right" onClick={joinSession}>
        Join
      </Button>
    </ControlGroup>
  );

  return (
    <ResizeSensor onResize={onResize}>
      <div>
        <div>Enter the session's id that you'd like to join:</div>
        <br />
        <div className="bp3-callout bp3-intent-primary bp3-icon-info-sign">
          <h4 className="bp3-heading ">Session ids</h4>
          Please note that a session id is an alphanumeric code
        </div>
        <br />
        {controlView}
      </div>
    </ResizeSensor>
  );
};
