import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, delay, Observable, of, throwError } from 'rxjs';
import { AppUser } from '../models/user.model';
import { LightComponent } from '../pages/home/widgets/light/light.component';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User,
  UserCredential,
  updateProfile,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private router: Router) {
    authState(this.auth).subscribe((firebaseUser) => {
      if (firebaseUser) {
        const appUser: AppUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Firebase User',
          role: 'user', // lehet, hogy később töltöd be Firestore-ból
          rooms: [],
        };
        this.currentUserSubject.next(appUser);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  signUp(
    email: string,
    password: string,
    name: string
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      (cred) => {
        console.log('Registration successful:', cred.user);
        return updateProfile(cred.user, { displayName: name }).then(() => {
          return cred.user.reload().then(() => cred);
        });
      }
    );
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  updateUser(updatedUser: AppUser) {
    this.currentUserSubject.next(updatedUser);
  }

  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/home');
    });
  }

  getCurrentUser(): Observable<AppUser | null> {
    return this.currentUser$;
  }
}
