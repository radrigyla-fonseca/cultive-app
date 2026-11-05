import { HttpClient } from '@angular/common/http';
import { 
    Injectable,
    inject
} from '@angular/core';

import { ESP32_URL } from '../app.config';

interface WifiCredentials {
    ssid: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class EstufaService {
    private http = inject(HttpClient);
    private addressESP = ESP32_URL;

    connectWifi(data: WifiCredentials) {
        return this.http.post(
            `${this.addressESP}/connect`,
            data
        );
    }
}
