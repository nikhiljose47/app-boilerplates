import { Component, inject, signal } from '@angular/core';
import { FirestoreService } from './firestore.service-r1';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <div *ngIf="user(); else guest">
      <p>Welcome {{ user()?.email }}</p>
      <button (click)="logout()">Logout</button>
    </div>
    <ng-template #guest>
      <button (click)="login()">Login</button>
    </ng-template>

    <div *ngFor="let item of items()">
      {{ item.name }}
    </div>
  `,
})
export class HomeComponent {
  private fs = inject(FirestoreService);
  user = signal<User | null>(null);
  items = signal<any[]>([]);

  constructor() {
    this.fs.user$.subscribe(u => this.user.set(u));
    this.fs.getCollection<any>('posts').subscribe(data => this.items.set(data));
  }

  login() {
    this.fs.login('test@mail.com', 'password123').subscribe();
  }

  logout() {
    this.fs.logout().subscribe();
  }
}
