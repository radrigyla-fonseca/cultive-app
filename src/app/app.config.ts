import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), 
    provideRouter(routes), 
    provideIonicAngular({}),
    provideHttpClient()
  ],

};

export const ESP32_URL = 'http://192.168.4.1';
export const ADDRESS_LOCAL_API = 'http://localhost:3000/api';
export const ADDRESS_API = 'https://cultive-t718.onrender.com/api';