import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import { FlexSpaceAround } from "../helpers/align";
import { ScrumPokerModel } from "./scrumPokerModel";

export const VotesTable: React.FC<{ model: ScrumPokerModel }> = observer(
  ({ model }) => {
    return model.percentage >= 1 ? (
      <>
        <hr />
        <h3>Votes</h3>
        <FlexSpaceAround>
          <Wrapper className="bp3-html-table bp3-html-table-striped bp3-html-table-bordered">
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
          </Wrapper>
        </FlexSpaceAround>
        <hr />
      </>
    ) : null;
  }
);

const Wrapper = styled.table`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${(p) => p.theme.spacing.md};
`;
