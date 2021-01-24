import { Button, Tag } from "@blueprintjs/core";
import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { IUserIdentity, useUserIdentity } from "../auth/context";
import { useSessionIdParam } from "../hooks/useSessionIdParam";
import { UserListModel } from "./userListModel";

export const SessionUsers: React.FC = () => {
  const sessionId = useSessionIdParam();
  const { user } = useUserIdentity();
  const [userList] = useState(() => new UserListModel());

  useEffect(() => {
    return userList.setup(sessionId, user as IUserIdentity);
  }, [userList, user, sessionId]);

  return <Users model={userList} />;
};

const Users: React.FC<{ model: UserListModel }> = observer(({ model }) => {
  const sessionId = useSessionIdParam();
  return (
    <Wrapper>
      <table className="bp3-html-table bp3-html-table-striped">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Is Owner</th>
          </tr>
        </thead>
        <tbody>
          {model.users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>
                {user.permissions?.isOwner ? (
                  <Tag intent="primary" title="Owner">
                    Owner
                  </Tag>
                ) : (
                  user.id !== model.currentUser?.id && (
                    <Button
                      small
                      onClick={() => model.makeOwner(sessionId, user.id)}
                      intent="primary"
                    >
                      Make owner
                    </Button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  padding-top: ${(p) => p.theme.spacing.xl};
  padding-bottom: ${(p) => p.theme.spacing.xl};
`;
