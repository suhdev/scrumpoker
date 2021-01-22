import React, { useEffect, useState } from "react";
import md5 from "md5";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
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
import { appHistory, toaster } from "./init";
import { LoginPage } from "./login";
import {
  AuthProvider,
  getLastSessionId,
  IUserIdentity,
  setLastSessionId,
  useUserIdentity,
} from "./auth/context";
import {
  ControlGroup,
  InputGroup,
  Button,
  Label,
  Menu,
  MenuItem,
  Alignment,
  Classes,
  Navbar,
  AnchorButton,
  ButtonGroup,
} from "@blueprintjs/core";
import styled from "styled-components";
import { db } from "./firebase";
import { action, makeObservable, observable, runInAction } from "mobx";
import { rmdir } from "fs";
import { observer } from "mobx-react";
import { SessionUsers } from "./usersList";
import { Layout, HeaderNav, Content, LeftNav, WorkingArea } from "./layout";
import { ScrumPokerPage } from "./scrumPoker";
import { RetroPage } from "./retro";

function App() {
  return (
    <AuthProvider>
      <Router history={appHistory}>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="*">
            <Application>
              <Switch>
                <Route path="/sessions/:sessionId">
                  <ScrumPokerSession />
                </Route>
                <Route path="*">
                  <SessionRedirect />
                </Route>
              </Switch>
            </Application>
          </Route>
        </Switch>
      </Router>
      ;
    </AuthProvider>
  );
}

export default App;

const Application: React.FC = ({ children }) => {
  const { user } = useUserIdentity();

  if (!user) {
    return <Redirect to="/login" />;
  }

  return children as any;
};

const ScrumPokerSession: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  useEffect(() => {
    setLastSessionId(sessionId);
  }, [sessionId]);

  return <ScrumPokerSessionInner key={sessionId} />;
};

export function useSessionIdParam() {
  return (useParams() as { sessionId: string }).sessionId;
}

const ScrumPokerSessionInner: React.FC = () => {
  const sessionId = useSessionIdParam();
  const history = useHistory();
  return (
    <Layout>
      <HeaderNav>
        <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>Scrum Miester</Navbar.Heading>
            <Navbar.Divider />
            <Link to="/abc" className="bp3-menu-item bp3-icon-layout-circle">
              abc
            </Link>
            <Link to="/good" className="bp3-menu-item bp3-icon-layout-circle">
              good
            </Link>
          </Navbar.Group>
        </Navbar>
      </HeaderNav>
      <Content>
        <LeftNav className={Classes.ELEVATION_1}>
          <SessionUsers />
          <ul className="bp3-menu bp3-list-unstyled">
            <li className="bp3-menu-header">
              <h6 className="bp3-heading">Apps</h6>
            </li>
            <li>
              <Link
                type="button"
                to={`/sessions/${sessionId}/scrum-poker`}
                className="bp3-menu-item bp3-icon-ninja"
              >
                Scrum Poker
              </Link>
            </li>
            <li>
              <Link
                type="button"
                to={`/sessions/${sessionId}/retro`}
                className="bp3-menu-item bp3-icon-data-lineage"
              >
                Retro
              </Link>
            </li>
          </ul>
        </LeftNav>
        <WorkingArea>
          <Switch>
            <Route path="/sessions/:sessionId/scrum-poker">
              <ScrumPokerPage />
            </Route>
            <Route path="/sessions/:sessionId/retro">
              <RetroPage />
            </Route>
            <Route path="*">
              <div className="bp3-non-ideal-state">
                <div className="bp3-non-ideal-state-visual">
                  <span className="bp3-icon bp3-icon-folder-open"></span>
                </div>
                <h4 className="bp3-heading">What would you like to do</h4>
                <div>Scrum Poker or Retro</div>
                <ButtonGroup>
                  <Button
                    icon="ninja"
                    onClick={() =>
                      history.push(`/sessions/${sessionId}/scrum-poker`)
                    }
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
            </Route>
          </Switch>
        </WorkingArea>
      </Content>
    </Layout>
  );
};

class BoundedList<TItem> {
  count: number;
  @observable.ref items: TItem[] = [];

  constructor(count: number) {
    this.count = count;
    this.items = [];
  }

  @action.bound
  add(item: TItem) {
    if (this.items.length === this.count) {
      return;
    }
    this.items = [...this.items, item];
  }

  @action.bound
  remove(item: TItem) {
    this.items = this.items.filter((e) => e !== item);
  }
}

const SessionRedirect: React.FC = () => {
  return <JoinSessionPage />;
};

const JoinSessionPage: React.FC = () => {
  const history = useHistory();
  const [session, setSessionId] = useState(
    getLastSessionId() || `${Date.now()}`
  );

  return (
    <Wrapper>
      <h1>Join a session</h1>
      <p>Please enter the session id you want to join</p>
      <ControlGroup fill={true} vertical={false}>
        <InputGroup
          placeholder="Session id"
          value={session}
          onChange={(e) => setSessionId(e.target.value)}
        />
        <Button icon="plus">Create new</Button>
      </ControlGroup>
      <br />
      <Button
        onClick={() => {
          setLastSessionId(session);

          history.push(`/sessions/${session}`);
        }}
      >
        Join
      </Button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 460px;
  padding-top: 100px;
  padding-bottom: 100px;
`;
