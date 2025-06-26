import { gql } from '@apollo/client';

export const GET_USER_BY_ID = gql`
    query getUserById($id: Float!) {
        getUserById(id: $id) {
            userName
            email
        }
    }
`;