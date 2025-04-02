import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, delay, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
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
      passwordConfirm: user.confirmPassword,
      rooms: [],
    };

    const currentUsers = this.usersSubject.value;
    this.usersSubject.next([...currentUsers, newUser]);

    console.log('New user:', newUser);

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

  logout() {
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/profile');
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }
}
