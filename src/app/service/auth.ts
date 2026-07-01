import { Injectable, signal } from '@angular/core';
import { User } from '../interface/product.interface';

const USERS_KEY = 'ecom_users';
const SESSION_KEY = 'ecom_session';

export type PublicUser = Pick<User, 'name' | 'email'>;

// Demo-only mock auth: users/passwords are stored in plaintext in localStorage.
// There is no real backend, so this is not meant to be secure.
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly currentUser = signal<PublicUser | null>(null);

  constructor() {
    this.loadSession();
  }

  private getUsers(): User[] {
    if (typeof localStorage === 'undefined') return [];
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveUsers(users: User[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }

  private loadSession() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        this.currentUser.set(JSON.parse(stored));
      }
    }
  }

  signup(name: string, email: string, password: string): { success: boolean; error?: string } {
    const users = this.getUsers();
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    users.push({ name, email, password });
    this.saveUsers(users);
    this.setSession({ name, email });
    return { success: true };
  }

  login(email: string, password: string): { success: boolean; error?: string } {
    const users = this.getUsers();
    const user = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
    );
    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }
    this.setSession({ name: user.name, email: user.email });
    return { success: true };
  }

  logout() {
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  private setSession(user: PublicUser) {
    this.currentUser.set(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }
  }
}
