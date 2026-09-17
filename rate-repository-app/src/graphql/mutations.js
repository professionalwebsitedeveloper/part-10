import { gql } from '@apollo/client';

export const AUTHENTICATE = gql`
  mutation authenticate($credentials: AuthenticateInput) {
    authenticate(credentials: $credentials) {
      accessToken
      user {
        id
        username
      }
    }
  }
`;