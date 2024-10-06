import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GasStationDTO } from '../Models/gas-station.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GasStationService {

  private urlGasolinerasApi: string;

  constructor(private http: HttpClient) {
    this.urlGasolinerasApi = 'http://localhost:3000/gasolineras';
   }

   getGasStationByLocation(location:  string): Observable<GasStationDTO[]>{    
    return this.http.get<GasStationDTO[]>(this.urlGasolinerasApi + '/' + location);
   }
}
