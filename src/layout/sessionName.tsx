import { ControlGroup, InputGroup, Button, Navbar } from "@blueprintjs/core";
import React, { useState, useCallback } from "react";
import { Async } from "react-async";
import { getSessionRef } from "../firebase";

export const SessionName: React.FC<{ sessionId?: string }> = ({
  sessionId,
}) => {
  const [name, setName] = useState("");
  const [isEditMode, setMode] = useState(false);
  const load = useCallback(async () => {
    if (sessionId) {
      const snapshot = await getSessionRef(sessionId).child("name").get();
      setName(snapshot.val());
      return snapshot.val();
    }
    return null;
  }, [setName, sessionId]);

  return (
    <Async promiseFn={load}>
      <Async.Loading>Loading...</Async.Loading>
      <Async.Resolved<string>>
        {(data) =>
          !data ? null : !isEditMode ? (
            <div
              className="bp3-menu-item bp3-icon-home"
              onDoubleClick={() => setMode((m) => true)}
            >
              {name || "Untitled session"}
            </div>
          ) : (
            <>
              <ControlGroup fill={true} vertical={false}>
                <InputGroup
                  placeholder="Session name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button
                  icon="stop"
                  onClick={() => {
                    setMode(false);
                  }}
                />
                <Button
                  icon="tick"
                  onClick={async () => {
                    if (sessionId) {
                      await getSessionRef(sessionId).child("name").set(name);
                      setMode(false);
                    }
                  }}
                />
              </ControlGroup>
              <Navbar.Divider />
            </>
          )
        }
      </Async.Resolved>
      <Async.Rejected>{(err) => err.message}</Async.Rejected>
    </Async>
  );
};
