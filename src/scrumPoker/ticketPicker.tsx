import {
  ControlGroup,
  InputGroup,
  Button,
  ResizeSensor,
} from "@blueprintjs/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useResize } from "../hooks/useResize";
import { useSessionIdParam } from "../hooks/useSessionIdParam";

export const TicketPicker: React.FC = () => {
  const { onResize, width } = useResize();
  const [ticketId, setTicketId] = useState("");
  const sessionId = useSessionIdParam();
  const history = useHistory();

  return (
    <ResizeSensor onResize={onResize}>
      <div className="bp3-non-ideal-state" style={{ paddingBottom: "100px" }}>
        <div className="bp3-non-ideal-state-visual">
          <span className="bp3-icon bp3-icon-folder-open"></span>
        </div>
        <h4 className="bp3-heading">
          Enter ticket number you want to estimate
        </h4>
        <ControlGroup fill={true} vertical={width <= 500}>
          <InputGroup
            placeholder="Ticket number"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
          />
          <Button
            icon="chevron-right"
            onClick={() => {
              history.push(
                `/sessions/${sessionId}/scrum-poker/${ticketId.trim()}`
              );
            }}
          >
            Go
          </Button>
        </ControlGroup>
      </div>
    </ResizeSensor>
  );
};
