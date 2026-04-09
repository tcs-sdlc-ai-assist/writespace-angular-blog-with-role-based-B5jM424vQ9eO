import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import type { Session } from '../models/session.model';
import type { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private sessionSubject = new BehaviorSubject<Session | null>(null);
  public session$ = this.sessionSubject.asObservable();

  constructor(private storageService: StorageService) {
    const existing = this.storageService.getSession();
    if (existing) {
      this.sessionSubject.next(existing);
    }
  }

  login(username: string, password: string): Promise<Session> {
    return new Promise((resolve, reject) => {
      try {
        if (username === 'admin' && password === 'admin') {
          const session: Session = {
            userId: 'admin',
            username: 'admin',
            displayName: 'Admin',
            role: 'admin'
          };
          this.storageService.setSession(session);
          this.sessionSubject.next(session);
          resolve(session);
          return;
        }

        const users = this.storageService.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
          reject(new Error('Invalid credentials'));
          return;
        }

        const session: Session = {
          userId: user.id,
          username: user.username,
          displayName: user.displayName,
          role: user.role
        };
        this.storageService.setSession(session);
        this.sessionSubject.next(session);
        resolve(session);
      } catch (error) {
        reject(new Error('Login failed'));
      }
    });
  }

  logout(): void {
    this.storageService.clearSession();
    this.sessionSubject.next(null);
  }

  register(displayName: string, username: string, password: string): Promise<Session> {
    return new Promise((resolve, reject) => {
      try {
        if (username === 'admin') {
          reject(new Error('Username not allowed'));
          return;
        }

        const users = this.storageService.getUsers();
        const existing = users.find(u => u.username === username);

        if (existing) {
          reject(new Error('Username taken'));
          return;
        }

        const newUser: User = {
          id: 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9),
          displayName,
          username,
          password,
          role: 'user',
          createdAt: new Date().toISOString()
        };

        this.storageService.addUser(newUser);

        const session: Session = {
          userId: newUser.id,
          username: newUser.username,
          displayName: newUser.displayName,
          role: 'user'
        };
        this.storageService.setSession(session);
        this.sessionSubject.next(session);
        resolve(session);
      } catch (error) {
        reject(new Error('Registration failed'));
      }
    });
  }

  getSession(): Session | null {
    return this.sessionSubject.getValue();
  }

  isAdmin(): boolean {
    const session = this.getSession();
    return session !== null && session.role === 'admin';
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
}