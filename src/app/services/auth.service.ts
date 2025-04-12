import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, delay, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { LightComponent } from '../pages/home/widgets/light/light.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usersSubject = new BehaviorSubject<User[]>([
    {
      id: 1,
      name: 'asdasd',
      email: 'asdasd@asd.com',
      role: 'user',
      password: 'asdasdasd',
      rooms: [
        {
          id: 1,
          name: 'asdasd',
          devices: [
            {
              id: 1,
              roomId: 1,
              label: 'roomlamp',
              content: LightComponent,
              rows: 1,
              columns: 1,
              backgroundColor: 'var(--mat-sys-primary)',
              color: 'white',
              contentData: {
                widgetId: 1,
                text: 'Brightness',
                switch: false,
              },
            },
          ],
        },
      ],
    },
  ]);
  users$ = this.usersSubject.asObservable();

  currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {}

  signUp(user: any): Observable<any> {
    if (user.password !== user.confirmPassword) {
      return throwError(() => 'Passwords do not match!');
    }

    const newUser: User = {
      id: Date.now(),
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password,
      rooms: [],
    };

    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([...currentUsers, newUser]);

    console.log('New user:', newUser);
    console.log('users:' + this.usersSubject.value);

    return of(newUser).pipe(delay(2000));
  }

  signIn(credentials: { email: string; password: string }): Observable<any> {
    const user = this.usersSubject.value.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return throwError(() => 'Invalid email or password');
    }

    console.log('User logged in:', user);
    this.currentUserSubject.next(user);

    return of(user).pipe(delay(1000));
  }

  updateUser(updatedUser: User) {
    const users = this.usersSubject.value.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    this.usersSubject.next(users);
    this.currentUserSubject.next(updatedUser);
  }

  logout() {
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/profile');
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }
}
