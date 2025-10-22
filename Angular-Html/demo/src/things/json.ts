// user.model.ts
export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  roles: string[];
  profile: {
    age: number;
    country: string;
  };
}

// app.component.ts
import { Component } from '@angular/core';
import { User } from './user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  users: User[] = [
    {
      id: 'u1',
      name: 'Nikhil',
      email: 'nikhil@example.com',
      isActive: true,
      roles: ['admin', 'editor'],
      profile: { age: 28, country: 'India' }
    },
    {
      id: 'u2',
      name: 'Anita',
      email: 'anita@example.com',
      isActive: false,
      roles: ['viewer'],
      profile: { age: 25, country: 'USA' }
    }
  ];
}


<!-- app.component.html -->
<div class="user-list">
  <div class="user-card" *ngFor="let user of users">
    <h3>{{ user.name }} <span *ngIf="user.isActive" class="status active">●</span></h3>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>Age:</strong> {{ user.profile.age }}</p>
    <p><strong>Country:</strong> {{ user.profile.country }}</p>

    <p><strong>Roles:</strong></p>
    <ul>
      <li *ngFor="let role of user.roles">{{ role }}</li>
    </ul>
  </div>
</div>


.user-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  padding: 16px;
}

.user-card {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.status.active {
  color: green;
  font-size: 14px;
}
