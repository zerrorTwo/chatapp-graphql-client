import { gql } from "@apollo/client";

export const GET_USER_BY_ID = gql`
  query user {
    getUserById {
      userName
      email
      id
      avatarUrl
      status
    }
  }
`;
