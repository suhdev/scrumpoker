import {
  Button,
  ControlGroup,
  InputGroup,
  ProgressBar,
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { useSessionIdParam } from "../App";
import { IUserIdentity, useUserIdentity } from "../auth/context";
import { ScrumPokerModel } from "./scrumPokerModel";

export const ScrumPokerPage: React.FC = () => {
  return (
    <Switch>
      <Route path="/sessions/:sessionId/scrum-poker/:ticketId">
        <ScrumPokerPageInner />
      </Route>
      <Route path="/sessions/:sessionId/scrum-poker">
        <TicketPicker />
      </Route>
    </Switch>
  );
};

const Timer: React.FC<{ model: ScrumPokerModel }> = observer(({ model }) => {
  return <ProgressBar intent="primary" value={model.percentage} />;
});

const TicketPicker: React.FC = () => {
  const [ticketId, setTicketId] = useState("");
  const sessionId = useSessionIdParam();
  const history = useHistory();
  return (
    <div className="bp3-non-ideal-state" style={{ paddingBottom: "100px" }}>
      <div className="bp3-non-ideal-state-visual">
        <span className="bp3-icon bp3-icon-folder-open"></span>
      </div>
      <h4 className="bp3-heading">Enter ticket number you want to estimate</h4>
      <ControlGroup fill={true} vertical={false}>
        <InputGroup
          placeholder="Ticket number"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
        />
        <Button
          icon="chevron-right"
          onClick={() => {
            history.push(
              `/sessions/${sessionId}/scrum-poker/${ticketId
                .toLowerCase()
                .trim()}`
            );
          }}
        >
          Go
        </Button>
      </ControlGroup>
    </div>
  );
};

const ScrumPokerPageInner: React.FC = () => {
  const { sessionId, ticketId } = useParams() as {
    sessionId: string;
    ticketId: string;
  };
  return (
    <ScrumPokerInner
      key={`${sessionId}_${ticketId}`}
      sessionId={sessionId}
      ticketId={ticketId}
    />
  );
};

const ScrumPokerInner: React.FC<{
  sessionId: string;
  ticketId: string;
}> = observer(({ sessionId, ticketId }) => {
  const { user } = useUserIdentity();
  const [vm] = useState(() => new ScrumPokerModel());

  useEffect(() => {
    return vm.setup(sessionId, ticketId, user as IUserIdentity);
  }, [vm, sessionId, ticketId, user]);

  return (
    <Wrapper>
      <Timer model={vm} />
      <Vote model={vm} />
    </Wrapper>
  );
});

const Vote: React.FC<{ model: ScrumPokerModel }> = observer(({ model }) => {
  return (
    <div className="bp3-non-ideal-state" style={{ paddingBottom: "100px" }}>
      <div className="bp3-non-ideal-state-visual">
        <Button intent="primary" onClick={() => model.start()}>
          {model.started ? "Restart" : "Start"}
        </Button>
      </div>
      <VoteInput model={model} />
      <Votes model={model} />
      <GoToTicket model={model} />
    </div>
  );
});

const VoteInput: React.FC<{ model: ScrumPokerModel }> = observer(
  ({ model }) => {
    const { user } = useUserIdentity();
    const { ticketId } = useParams() as { ticketId: string };
    const [value, setValue] = useState("1");
    return model.percentage < 1 ? (
      <>
        <h4 className="bp3-heading">
          Enter your vote below for ticket: {ticketId}
        </h4>
        <ControlGroup fill={true} vertical={false}>
          <InputGroup
            placeholder="Ticket number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            icon="chevron-right"
            onClick={() => {
              model.vote(user!.id, value);
            }}
          >
            Vote
          </Button>
        </ControlGroup>
      </>
    ) : null;
  }
);

const Votes: React.FC<{ model: ScrumPokerModel }> = observer(({ model }) => {
  return model.percentage >= 1 ? (
    <table className="bp3-html-table .modifier">
      <thead>
        <tr>
          <th>Name</th>
          <th>Vote</th>
        </tr>
      </thead>
      <tbody>
        {model.userVotes.map((v) => (
          <tr key={v.id}>
            <td>{v.fullname}</td>
            <td>{v.vote}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : null;
});

const GoToTicket: React.FC<{ model: ScrumPokerModel }> = observer(
  ({ model }) => {
    const [value, setValue] = useState("");
    const { sessionId } = useParams() as {
      sessionId: string;
      ticketId: string;
    };
    const history = useHistory();
    return model.percentage >= 1 ? (
      <>
        <ControlGroup fill={true} vertical={false}>
          <InputGroup
            placeholder="Ticket number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            icon="chevron-right"
            onClick={() => {
              if (value.trim()) {
                history.push(
                  `/sessions/${sessionId}/scrum-poker/${value
                    .trim()
                    .toLowerCase()}`
                );
              }
            }}
          >
            Go to ticket
          </Button>
        </ControlGroup>
      </>
    ) : null;
  }
);

const Wrapper = styled.div`
  padding: 32px;
`;
