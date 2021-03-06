import React, { useCallback, useEffect, useState } from "react";
import {
  Navbar,
  Alignment,
  ResizeSensor,
  MenuItem,
  Button,
} from "@blueprintjs/core";
import { Link, Route, Switch, useHistory, useParams } from "react-router-dom";
import { HeaderNav } from ".";
import { SessionName } from "./sessionName";
import { useSessionIdParam } from "../hooks/useSessionIdParam";
import logo from "../assets/logo.svg";
import { useResize } from "../hooks/useResize";
import { Select } from "@blueprintjs/select";
import { CenterAlignedRow } from "../helpers/align";
import { getScrumPokerTicketsRef } from "../firebase";

export const TopNav: React.FC = () => {
  const { width, onResize } = useResize();
  const sessionId = useSessionIdParam();
  const history = useHistory();

  return (
    <ResizeSensor onResize={onResize}>
      <HeaderNav>
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading style={{ marginRight: "0px" }}>
              <img
                onClick={() => {
                  history.push("/start");
                }}
                style={{ height: "32px", cursor: "pointer" }}
                src={logo}
                alt="Scrum Miester"
              />
            </Navbar.Heading>
            <Navbar.Divider />
            <SessionName sessionId={sessionId} />

            <Route path="/sessions/:sessionId">
              <Switch>
                <Route path="/sessions/:sessionId/scrum-poker/:ticketId">
                  <TicketSelection width={width} />
                </Route>
                <Route path="/sessions/:sessionId">
                  <TicketSelection width={width} />
                </Route>
              </Switch>
              <Route
                render={({
                  match: {
                    params: { sessionId },
                  },
                }) => (
                  <Link
                    to={`/sessions/${sessionId}/users`}
                    className="bp3-menu-item bp3-icon-people"
                    title="Users"
                  >
                    {width < 500 ? "" : "Users"}
                  </Link>
                )}
              />
            </Route>

            <Link
              to="/start"
              className="bp3-menu-item bp3-icon-new-object bp3-intent-primary"
            >
              {width > 500 ? "Join Session" : ""}
            </Link>
            {sessionId ? (
              <>
                <Link
                  to={`/sessions/${sessionId}/scrum-poker`}
                  className="bp3-menu-item bp3-icon-layout-circle"
                >
                  Scrum Poker
                </Link>
                <Link
                  to={`/sessions/${sessionId}/retro`}
                  className="bp3-menu-item bp3-icon-layout-circle"
                >
                  Retro
                </Link>
              </>
            ) : null}
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <Link
              to="/profile"
              className="bp3-menu-item bp3-icon-user"
              title="Profile"
            >
              {width < 500 ? "" : "Profile"}
            </Link>
            <Link
              to="/logout"
              className="bp3-menu-item bp3-icon-log-out"
              title="Logout"
            >
              {width < 500 ? "" : "Logout"}
            </Link>
          </Navbar.Group>
        </Navbar>
      </HeaderNav>
    </ResizeSensor>
  );
};

const TicketSelection: React.FC<{ width: number }> = ({ width }) => {
  const [items, setItems] = useState<string[]>([]);
  const [ticket, setTicket] = useState<string | null>(null);
  const sessionId = useSessionIdParam();
  const { ticketId: currentTicketId } = useParams<{ ticketId?: string }>();
  const history = useHistory();

  const onItemSelect = useCallback(
    (item: string | null) => {
      if (item) {
        setTicket(item);
        history.push(`/sessions/${sessionId}/scrum-poker/${item}`);
      }
    },
    [setTicket, history, sessionId]
  );

  useEffect(() => {
    const ref = getScrumPokerTicketsRef(sessionId);
    ref.once("value", (snapshot) => {
      setItems(Object.keys(snapshot.val() || {}));
    });

    ref.on("child_added", (snapshot) => {
      setItems((items) => [...items, snapshot.key as string]);
    });

    return () => {
      ref.off("value");
      ref.off("child_added");
    };
  }, [sessionId, setItems]);

  useEffect(() => {
    if (currentTicketId) {
      setItems((items) => {
        if (items.find((x) => x === currentTicketId)) {
          return items;
        }
        return [...items, currentTicketId];
      });
    }
  }, [currentTicketId, setItems]);

  return (
    <CenterAlignedRow>
      {width > 500 ? <span>Ticket:&nbsp;&nbsp;</span> : null}
      <TicketSelect
        items={items}
        activeItem={currentTicketId || ticket}
        filterable={false}
        itemRenderer={(item, itemProps) => (
          <MenuItem
            key={item}
            active={itemProps.modifiers.active || item === currentTicketId}
            onClick={itemProps.handleClick}
            text={item}
          />
        )}
        noResults={<MenuItem disabled={true} text="No results." />}
        onItemSelect={onItemSelect}
      >
        <Button
          text={currentTicketId || ticket || "No selection"}
          rightIcon="double-caret-vertical"
        />
      </TicketSelect>
      <Navbar.Divider />
    </CenterAlignedRow>
  );
};

const TicketSelect = Select.ofType<string>();
