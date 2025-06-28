import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      user {
        id
        userName
        email
      }
      accessToken
    }
  }
`;

export const GOOGLE_LOGIN_MUTATION = gql`
  mutation LoginWithGoogle($input: String!) {
    loginWithGoogleIdToken(input: $input) {
      accessToken
      user {
        id
        userName
        email
      }
    }
  }
`;
