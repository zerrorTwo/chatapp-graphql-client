import { gql } from '@apollo/client';

export const SET_REFRESH_TOKEN_MUTATION = gql`
    mutation SetRefreshTokenCookie {
        setRefreshTokenCookie
    }
`;
