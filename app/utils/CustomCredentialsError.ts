import { CredentialsSignin } from 'next-auth'; // Import CredentialsSignin
export class CustomCredentialsError extends CredentialsSignin {
  constructor(message: string, code: any) {
    super();
    this.message = message;
    this.code = code;
  }
}