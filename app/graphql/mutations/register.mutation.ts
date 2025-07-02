import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Register(
    $email: String!
    $password: String!
    $userName: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        userName: $userName
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      user {
        id
        userName
        email
      }
      accessToken
    }
  }
`;
