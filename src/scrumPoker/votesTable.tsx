import { observer } from "mobx-react";
import React from "react";
import { ScrumPokerModel } from "./scrumPokerModel";

export const VotesTable: React.FC<{ model: ScrumPokerModel }> = observer(
  ({ model }) => {
    return model.percentage >= 1 ? (
      <table className="bp3-html-table .modifier">
        <thead>
          <tr>
            <th>Name</th>
            <th>Vote</th>
          </tr>
        </thead>
        <tbody>
          {model.userVotes.map((v) => (
            <tr key={v.id}>
              <td>{v.fullname}</td>
              <td>{v.vote}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : null;
  }
);
