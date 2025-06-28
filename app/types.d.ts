export {};

declare global {
  namespace google.accounts.id {
    interface CredentialResponse {
      credential: string;
      select_by: string;
      clientId: string;
    }
  }
}
