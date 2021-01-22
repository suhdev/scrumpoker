import { Menu, MenuItem } from "@blueprintjs/core";
import { observer } from "mobx-react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserIdentity, IUserIdentity } from "../auth/context";
import { UserListModel } from "./userListModel";

export const SessionUsers: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useUserIdentity();
  const [userList] = useState(() => new UserListModel());

  useEffect(() => {
    userList.add(user as IUserIdentity, false);
    return userList.setup(sessionId, user as IUserIdentity);
  }, [userList, user]);

  return <Users model={userList} />;
};

const Users: React.FC<{ model: UserListModel }> = observer(({ model }) => {
  return (
    <Menu>
      <li className="bp3-menu-header">
        <h6 className="bp3-heading">Users</h6>
      </li>
      <UsersInner model={model} />
    </Menu>
  );
});

const UsersInner: React.FC<{ model: UserListModel }> = observer(({ model }) => {
  return (
    <>
      {model.users.map((user) => (
        <MenuItem key={user.email} text={user.fullname} icon="user"></MenuItem>
      ))}
    </>
  );
});
