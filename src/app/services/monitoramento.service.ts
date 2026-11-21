import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InfluxRecord, ApiResponse } from '../models/medicoes.model';
import { ADDRESS_API } from '../app.config';

@Injectable({
    providedIn: 'root'
})
export class MonitoramentoService {
    constructor(private http: HttpClient) {}

    private apiUrl = `${ADDRESS_API}/monitoramento`; // monitoramentoRoutes

    /*
        Recebe idEstufa
        Envia uma requisição tipo GET - endpoint que InfluxDB retorna nível do reservatório
        Retorna uma resposta (Observable) no modelo ApiResponse 
    */
    getData(idEstufa: string): Observable<ApiResponse<InfluxRecord>> {
        return this.http.get<ApiResponse<InfluxRecord>>(`${this.apiUrl}/${idEstufa}`);
    }

}
