import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GasStationDTO } from '../Models/gas-station.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GasStationService {

  private urlGasolinerasApi: string;

  constructor(private http: HttpClient) {
    //this.urlGasolinerasApi = 'http://localhost:3000/gasstations';  //Entorno PRE
    this.urlGasolinerasApi = 'https://searchgasbe.onrender.com/gasstations';  //Entorno PROD
  }

   getGasStationByLocation(location:  string): Observable<GasStationDTO[]>{    
    return this.http.get<GasStationDTO[]>(this.urlGasolinerasApi + '/' + location);
   }

   getGasStationByLocationAndFuel(location:  string, fuel: string[]): Observable<GasStationDTO[]>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);    
    return this.http.get<GasStationDTO[]>(this.urlGasolinerasApi + '/' + location + '/' + fuel, { headers });
   }
}
