import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  delay,
  Observable,
  of,
  Subscription,
  throwError,
} from 'rxjs';
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
import {
  collection,
  doc,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Room } from '../models/room.model';
import { Widget } from '../models/widget';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);
  private userCollection = collection(this.firestore, 'AppUser');
  private roomCollection = collection(this.firestore, 'Room');
  private widgetCollection = collection(this.firestore, 'Widget');

  currentUserSubject = new BehaviorSubject<AppUser | null | undefined>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private authStateSubscription!: Subscription;

  constructor() {
    this.currentUserSubject.next(undefined);

    this.authStateSubscription = authState(this.auth).subscribe(
      (firebaseUser) => {
        if (firebaseUser) {
          this.loadUserData(firebaseUser);
        } else {
          this.currentUserSubject.next(null);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
  }

  async loadUserData(firebaseUser: User): Promise<void> {
    try {
      const userRef = doc(this.userCollection, firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        this.currentUserSubject.next(null);
        return;
      }

      const userData = userSnap.data();

      const roomIds: string[] = Array.isArray(userData['rooms'])
        ? userData['rooms']
        : [];

      const rooms: Room[] = [];

      const roomPromises = roomIds.map(async (roomId) => {
        try {
          const roomRef = doc(this.roomCollection, roomId);
          const roomSnap = await getDoc(roomRef);

          if (!roomSnap.exists()) return null;
          const roomData = roomSnap.data();

          if (roomData['userId'] !== firebaseUser.uid) return null;

          const deviceIds: string[] = Array.isArray(roomData['devices'])
            ? roomData['devices']
            : [];

          const devicePromises = deviceIds.map(async (deviceId) => {
            const deviceRef = doc(this.widgetCollection, deviceId);
            const deviceSnap = await getDoc(deviceRef);

            if (deviceSnap.exists()) {
              const deviceData = deviceSnap.data();
              if (deviceData['roomId'] === roomId) {
                return {
                  id: deviceId,
                  ...deviceData,
                  orderIndex: deviceData['orderIndex'] || 0,
                } as WidgetWithOrder;
              }
            }
            return null;
          });

          const resolvedDevices = (await Promise.all(devicePromises))
            .filter((device): device is WidgetWithOrder => device !== null)
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
            .map(({ orderIndex, ...rest }) => rest as Widget);

          return {
            id: roomId,
            userId: roomData['userId'] || firebaseUser.uid,
            name: roomData['name'] || 'Unnamed Room',
            devices: resolvedDevices,
          } as Room;
        } catch (error) {
          console.error(`Error loading room ${roomId}:`, error);
          return null;
        }
      });

      const resolvedRooms = (await Promise.all(roomPromises)).filter(
        (room) => room !== null
      ) as Room[];

      const appUser: AppUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email || userData['email'] || '',
        name: firebaseUser.displayName || userData['name'] || 'User',
        role: userData['role'] || 'user',
        rooms: resolvedRooms,
      };

      this.currentUserSubject.next(appUser);
    } catch (error) {
      console.error('Error loading user data:', error);
      this.currentUserSubject.next(null);
    }
  }

  signUp(
    email: string,
    password: string,
    name: string
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (cred) => {
        await updateProfile(cred.user, { displayName: name });
        await cred.user.reload();

        const newUser: AppUser = {
          id: cred.user.uid,
          email: email,
          name: name,
          role: 'user',
          rooms: [],
        };

        const userRef = doc(this.firestore, 'AppUser', cred.user.uid);
        await setDoc(userRef, {
          email: newUser.email,
          id: cred.user.uid,
          name: newUser.name,
          role: newUser.role,
          rooms: newUser.rooms,
          createdAt: new Date(),
        });

        this.currentUserSubject.next(newUser);
        return cred;
      })
      .catch((error) => {
        console.error('Error during sign up:', error);
        throw error;
      });
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    this.currentUserSubject.next(undefined);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  updateUser(updatedUser: AppUser) {
    this.currentUserSubject.next(updatedUser);
  }

  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/home');
      this.currentUserSubject.next(null);
    });
  }

  getCurrentUser(): Observable<AppUser | null | undefined> {
    return this.currentUser$;
  }
}

interface WidgetWithOrder extends Widget {
  orderIndex?: number;
}
