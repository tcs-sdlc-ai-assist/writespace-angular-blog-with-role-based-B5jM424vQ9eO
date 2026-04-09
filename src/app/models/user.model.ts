export interface User {
  id: string;
  displayName: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
}