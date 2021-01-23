import { Menu, MenuItem } from "@blueprintjs/core";
import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import { useUserIdentity, IUserIdentity } from "../auth/context";
import { useSessionIdParam } from "../hooks/useSessionIdParam";
import { UserListModel } from "./userListModel";

export const SessionUsers: React.FC = () => {
  const sessionId = useSessionIdParam();

  if (!sessionId) {
    return null;
  }

  return <SessionUsersInner />;
};

const SessionUsersInner: React.FC = () => {
  const sessionId = useSessionIdParam();

  const { user } = useUserIdentity();
  const [userList] = useState(() => new UserListModel());

  useEffect(() => {
    userList.add(user as IUserIdentity, false);
    return userList.setup(sessionId, user as IUserIdentity);
  }, [userList, user, sessionId]);

  return <Users model={userList} />;
};

const Users: React.FC<{ model: UserListModel }> = observer(({ model }) => {
  return (
    <Menu>
      <li className="bp3-menu-header">
        <h6 className="bp3-heading">Users in this session</h6>
      </li>
      <UsersInner model={model} />
    </Menu>
  );
});

const UsersInner: React.FC<{ model: UserListModel }> = observer(({ model }) => {
  return (
    <>
      {model.users.map((user) => (
        <MenuItem
          key={user.email}
          text={
            <>
              {user.fullname}{" "}
              {/* {user.permissions?.isOwner && (
                <Tag intent="primary" title="Session Owner">
                  Owner
                </Tag>
              )} */}
            </>
          }
          icon="user"
        ></MenuItem>
      ))}
    </>
  );
});
