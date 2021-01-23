import React, { useEffect, useState } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "./App.css";
import {
  Link,
  Redirect,
  Route,
  Router,
  Switch,
  useHistory,
  useParams,
} from "react-router-dom";
import { appHistory } from "./init";
import {
  AuthProvider,
  setLastSessionId,
  useUserIdentity,
} from "./auth/context";
import { Button, ButtonGroup, Menu } from "@blueprintjs/core";
import { ThemeProvider } from "styled-components";
import { Layout, Content, WorkingArea } from "./layout";
import { ScrumPokerPage } from "./scrumPoker";
import { RetroPage } from "./retro";
import { getScrumPokerTicketsRef } from "./firebase";
import { observer } from "mobx-react";
import { AttemptLoginPage } from "./login/attemptLogin";
import { LogoutPage } from "./login/logout";
import { StartPage } from "./startPage";
import { TopNav } from "./layout/topNav";
import { useSessionIdParam } from "./hooks/useSessionIdParam";
import { DefaultTheme } from "./theme";
import { ProfilePage } from "./profile";

function App() {
  return (
    <ThemeProvider theme={DefaultTheme}>
      <AuthProvider>
        <Router history={appHistory}>
          <Switch>
            <Route path="/login">
              <AttemptLoginPage />
            </Route>
            <Route path="/signup">{/* <SignUpPage /> */}</Route>
            <Route path="/logout">
              <LogoutPage />
            </Route>
            <Route path="*">
              <Application />
            </Route>
          </Switch>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

const Application: React.FC = ({ children }) => {
  const { user } = useUserIdentity();

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <ScrumPokerSessionInner />;
};

const AppInner: React.FC = ({ children }) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  useEffect(() => {
    setLastSessionId(sessionId);
  }, [sessionId]);

  return <React.Fragment key={sessionId}>{children}</React.Fragment>;
};

const ScrumPokerSessionInner: React.FC = () => {
  return (
    <Layout>
      <TopNav />
      <Content>
        <WorkingArea>
          <Switch>
            <Route path="/start">
              <StartPage />
            </Route>
            <Route path="/profile">
              <ProfilePage />
            </Route>
            <Route path="/sessions/:sessionId/scrum-poker">
              <AppInner>
                <ScrumPokerPage />
              </AppInner>
            </Route>
            <Route path="/sessions/:sessionId/retro">
              <RetroPage />
            </Route>
            <Route path="/sessions/:sessionId">
              <AppInner>
                <AppPicker />
              </AppInner>
            </Route>
          </Switch>
        </WorkingArea>
      </Content>
    </Layout>
  );
};

const AppPicker: React.FC = () => {
  const sessionId = useSessionIdParam();
  const history = useHistory();
  return (
    <div className="bp3-non-ideal-state" style={{ paddingBottom: "1rem" }}>
      <div className="bp3-non-ideal-state-visual">
        <span className="bp3-icon bp3-icon-folder-open"></span>
      </div>
      <h4 className="bp3-heading">What would you like to do</h4>
      <div>Scrum Poker or Retro</div>
      <ButtonGroup>
        <Button
          icon="ninja"
          onClick={() => history.push(`/sessions/${sessionId}/scrum-poker`)}
        >
          Scrum Poker
        </Button>
        <Button
          icon="data-lineage"
          onClick={() => history.push(`/sessions/${sessionId}/retro`)}
        >
          Retro
        </Button>
      </ButtonGroup>
    </div>
  );
};

export const TicketList: React.FC = observer(() => {
  const { sessionId, ticketId } = useParams<{
    sessionId: string;
    ticketId: string;
  }>();
  const [tickets, setTickets] = useState<string[]>([]);

  useEffect(() => {
    const ref = getScrumPokerTicketsRef(sessionId);

    ref.on("value", (val) => {
      setTickets(Object.keys(val.val() || {}));
    });

    return () => {
      ref.off("value");
    };
  }, [sessionId, setTickets]);

  return (
    <Menu>
      <li className="bp3-menu-header">
        <h6 className="bp3-heading">Tickets in this session</h6>
      </li>
      {tickets.map((t) => (
        <Link
          key={t}
          to={`/sessions/${sessionId}/scrum-poker/${t}`}
          className={`bp3-menu-item bp3-icon-ninja ${
            ticketId === t ? "bp3-active" : ""
          }`}
        >
          {t}
        </Link>
      ))}
    </Menu>
  );
});
