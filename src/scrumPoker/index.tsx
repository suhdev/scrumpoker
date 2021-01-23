import React from "react";
import { Route, Switch } from "react-router-dom";
import { TicketPicker } from "./ticketPicker";
import { TicketVoting } from "./ticketVoting";

export const ScrumPokerPage: React.FC = () => {
  return (
    <Switch>
      <Route path="/sessions/:sessionId/scrum-poker/:ticketId">
        <TicketVoting />
      </Route>
      <Route path="/sessions/:sessionId/scrum-poker">
        <TicketPicker />
      </Route>
    </Switch>
  );
};
