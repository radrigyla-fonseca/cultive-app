import { HttpClient } from '@angular/common/http';
import { 
    Injectable,
    inject
} from '@angular/core';

import { EstufaOnline } from '../models/estufa.model';

import { ESP32_URL, ADDRESS_LOCAL_API, ADDRESS_API } from '../app.config';
import { ApiResponse } from '../models/api-response';

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
    private addressAPI = ADDRESS_API;
    private addressLocalAPI = ADDRESS_LOCAL_API;
    

    // Post dos dados da rede local para conexão do ESP
    connectWifi(data: WifiCredentials) {
        return this.http.post(
            `${this.addressESP}/connect`,
            data
        );
    }

    getEstufasOnline() {
        return this.http.get<ApiResponse<EstufaOnline[]>>(
            `${this.addressAPI}/estufas/online`
        );
    }
}
