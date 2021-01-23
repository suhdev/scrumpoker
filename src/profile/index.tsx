import {
  Button,
  ControlGroup,
  InputGroup,
  Label,
  ResizeSensor,
} from "@blueprintjs/core";
import React, { useState } from "react";
import styled from "styled-components";
import { IUserIdentity, useUserIdentity } from "../auth/context";
import { updateProfile } from "../firebase";
import { FlexEnd } from "../helpers/align";
import { useResize } from "../hooks/useResize";

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useUserIdentity();
  const [fullname, setFullname] = useState(user?.fullname || "");
  const { onResize, width } = useResize();
  return (
    <ResizeSensor onResize={onResize}>
      <ProfileWrapper>
        <ControlGroup fill={true} vertical={width < 400}>
          <LeftLabel>Full Name</LeftLabel>
          <InputGroup
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </ControlGroup>
        <br />
        <FlexEnd>
          <Button
            intent="primary"
            icon="saved"
            onClick={async () => {
              await updateProfile(fullname);
              setUser({ ...(user as IUserIdentity), fullname: fullname });
            }}
          >
            Save
          </Button>
        </FlexEnd>
      </ProfileWrapper>
    </ResizeSensor>
  );
};

const ProfileWrapper = styled.div`
  max-width: 500px;
  padding-top: ${(p) => p.theme.spacing.xl};
  padding-bottom: ${(p) => p.theme.spacing.xl};
  padding-left: ${(p) => p.theme.spacing.md};
  padding-right: ${(p) => p.theme.spacing.md};
  margin-left: auto;
  margin-right: auto;
`;

const LeftLabel = styled(Label)`
  width: 100px;
`;
