import { Button, ControlGroup, InputGroup, Spinner } from "@blueprintjs/core";
import { observer, Observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";
import { useUserIdentity, IUserIdentity } from "../auth/context";
import {
  CenterAlignedRow,
  Flex,
  FlexRow,
  FlexSpaceAround,
  FlexSpaceBetween,
} from "../helpers/align";
import { ScrumPokerModel } from "./scrumPokerModel";
import { VotesTable } from "./votesTable";

export const TicketVoting: React.FC = () => {
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
      <Vote model={vm} ticketId={ticketId} />
    </Wrapper>
  );
});

const Vote: React.FC<{ model: ScrumPokerModel; ticketId: string }> = observer(
  ({ model, ticketId }) => {
    return (
      <>
        <FlexSpaceBetween direction={"row"}>
          <VoteHeading>Ticket: {ticketId}</VoteHeading>
          {model.started || !model.canStart ? null : (
            <Button intent="primary" onClick={() => model.start()}>
              Start
            </Button>
          )}
        </FlexSpaceBetween>
        <br />
        <div className="bp3-callout bp3-intent-primary bp3-icon-info-sign">
          <h4 className="bp3-heading ">Voting on estimate for {ticketId}</h4>
          Once the vote start, please select a value from the list below. Please
          consider complexity of the acceptance criteria compared to past
          experience.
        </div>
        {(model.percentage < 1 || !model.started) && (
          <>
            <CenterAlignedRow style={{ marginTop: "1rem" }}>
              <Spinner
                intent="primary"
                value={model.started ? model.percentage : undefined}
              />
              <span style={{ marginLeft: "1rem" }}>
                {model.started ? "Voting" : "Waiting for voting to start"}
              </span>
            </CenterAlignedRow>
          </>
        )}
        {model.started && <VoteInput model={model} />}

        <VotesTable model={model} />
        {model.percentage >= 1 ? <GoToTicket model={model} /> : null}
      </>
    );
  }
);

const VoteHeading = styled.div`
  font-size: 24px;
`;

const VoteInput: React.FC<{ model: ScrumPokerModel }> = observer(
  ({ model }) => {
    const { user } = useUserIdentity();
    const { ticketId } = useParams() as { ticketId: string };
    return model.percentage < 1 ? (
      <VoteWrapper>
        <h4 className="bp3-heading">
          Enter your vote below for ticket: {ticketId}
        </h4>
        <ControlGroup fill={true} vertical={false}>
          {[1, 2, 3, 5, 8, 13, 21].map((ticket) => (
            <Observer key={ticket}>
              {() => (
                <VoteButton
                  large
                  intent={
                    model.getVoteForUser(user!.id) === ticket
                      ? "primary"
                      : undefined
                  }
                  onClick={() => {
                    model.vote(user!.id, `${ticket}`);
                  }}
                >
                  {ticket}
                </VoteButton>
              )}
            </Observer>
          ))}
        </ControlGroup>
      </VoteWrapper>
    ) : null;
  }
);

const VoteWrapper = styled.div`
  margin-top: 1rem;
`;

const VoteButton = styled(Button)`
  padding-left: 20px;
  padding-right: 20px;
`;

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
        <br />
        <h3>Enter ticket number to vote on next</h3>
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
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;
