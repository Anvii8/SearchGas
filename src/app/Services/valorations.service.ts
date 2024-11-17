import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ValorationsDTO } from '../Models/valorations.dto';

@Injectable({
  providedIn: 'root'
})
export class ValorationsService {
  private urlValorationsApi: string;

  constructor(private http: HttpClient) {
    this.urlValorationsApi = 'http://localhost:3000/valorations';  //Entorno PRE
    //this.urlValorationsApi = 'https://searchgasbe.onrender.com/valorations';  //Entorno PROD
  }

  getValorationsByGasStation(gasStationId: number): Observable<ValorationsDTO[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ValorationsDTO[]>(this.urlValorationsApi + '/gasStation/' + gasStationId, { headers }).pipe(
      catchError(err => {
        console.error('Error al obtener las valoraciones de la gasolinera', err);
        return throwError(() => new Error(err));
      })
    );
  }

  addValoration(userId: string, gasStationId: number, rating:number, comment:string): Observable<any>{
    const token = localStorage.getItem('access_token');    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { userId, gasStationId, rating, comment };
    return this.http.post(this.urlValorationsApi + '/add', body, { headers }).pipe(
      catchError(err => {
        console.error('Error al añadir la valoración', err);
        return throwError(() => new Error(err));
      })
    );
  }
}
