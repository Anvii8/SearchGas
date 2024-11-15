import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GasStationDTO } from '../Models/gas-station.dto';
import { catchError, Observable, tap, throwError } from 'rxjs';

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
    return this.http.get<GasStationDTO[]>(this.urlGasolinerasApi + '/location/' + location).pipe(
      catchError(err => {
        console.error('Error al obtener las gasolineras por localidad', err);
        return throwError(() => new Error(err));
      })
    );
   }

   getGasStationByLocationAndFuel(location:  string, fuel: string[]): Observable<GasStationDTO[]>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);    
    return this.http.get<GasStationDTO[]>(this.urlGasolinerasApi + '/location/' + location + '/fuel/' + fuel, { headers }).pipe(
      catchError(err => {
        console.error('Error al obtener las gasolineras por localidad y fuel', err);
        return throwError(() => new Error(err));
      })
    );
   }

   getGasStationById(id:  number): Observable<GasStationDTO>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);    
    return this.http.get<GasStationDTO>(this.urlGasolinerasApi + '/id/' + id, { headers }).pipe(
      catchError(err => {
        console.error('Error al obtener la gasolinera by Id', err);
        return throwError(() => new Error(err));
      })
    );
   }
}
