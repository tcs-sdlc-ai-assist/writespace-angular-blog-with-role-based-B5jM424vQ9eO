export interface Session {
  userId: string;
  username: string;
  displayName: string;
  role: 'admin' | 'user';
}