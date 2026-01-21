import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = new BehaviorSubject<UserModel>({
    uid: 'guest',
    email: null,
    username: 'Guest'
  });
  user$ = this._user.asObservable();

  constructor(private auth: Auth) {
    // Listen to Firebase Auth state
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this._user.next({
          uid: user.uid,
          email: user.email,
          username: user.displayName || user.email?.split('@')[0] || 'User'
        });
      } else {
        this._user.next({ uid: 'guest', email: null, username: 'Guest' });
      }
    });
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    await signOut(this.auth);
  }
}
