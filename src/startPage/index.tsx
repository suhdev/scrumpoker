import { Tabs, Tab } from "@blueprintjs/core";
import React, { useState } from "react";
import styled from "styled-components";
import { CreateNewSession } from "./createNewSession";
import { JoinSession } from "./joinSession";

export const StartPage: React.FC = () => {
  const [tabId, setTabId] = useState("join");

  return (
    <StartPageWrapper>
      <h2>What would you like to do?</h2>

      <Tabs
        id="LoginMethodTabs"
        onChange={setTabId as any}
        selectedTabId={tabId}
        large
      >
        <Tab id="join" title="Join session" panel={<JoinSession />} />
        <Tab id="new" title="Create new session" panel={<CreateNewSession />} />
      </Tabs>
    </StartPageWrapper>
  );
};

const StartPageWrapper = styled.div`
  padding-top: ${(p) => p.theme.spacing.lg};
  padding-bottom: ${(p) => p.theme.spacing.lg};
  padding-left: ${(p) => p.theme.spacing.md};
  padding-right: ${(p) => p.theme.spacing.md};
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;
