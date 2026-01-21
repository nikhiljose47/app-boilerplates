import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../state/auth/auth.actions';
import { selectUser, selectIsGuest } from '../state/auth/auth.selectors';

@Component({
  selector: 'app-auth',
  template: `
    <div *ngIf="user$ | async as user">
      <p>Welcome, {{ user.displayName }}</p>
      <button *ngIf="isGuest$ | async" (click)="login()">Login</button>
      <button *ngIf="!(isGuest$ | async)" (click)="logout()">Logout</button>
    </div>
  `,
})
export class AuthComponent {
  user$ = this.store.select(selectUser);
  isGuest$ = this.store.select(selectIsGuest);

  constructor(private store: Store) {}

  login() {
    this.store.dispatch(AuthActions.login({ email: 'test@mail.com', password: '123456' }));
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
