import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'smarthome-c8706',
        appId: '1:303891328766:web:8f20d1928ca44abf1c7faf',
        storageBucket: 'smarthome-c8706.firebasestorage.app',
        apiKey: 'AIzaSyCyOLqamvqW2aZcYs3KneRGAeqIRtI56tw',
        authDomain: 'smarthome-c8706.firebaseapp.com',
        messagingSenderId: '303891328766',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
