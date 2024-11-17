import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { GasStationDTO } from '../Models/gas-station.dto';
import { FavoritesDTO } from '../Models/favorites.dto';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private urlFavoritesApi: string;

  constructor(private http: HttpClient) {
    //this.urlFavoritesApi = 'http://localhost:3000/favorites';  //Entorno PRE
    this.urlFavoritesApi = 'https://searchgasbe.onrender.com/favorites';  //Entorno PROD
  }

  getUserFavorites(userId: string): Observable<FavoritesDTO[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<FavoritesDTO[]>(this.urlFavoritesApi + '/user/' + userId, { headers }).pipe(
      catchError(err => {
        console.error('Error al obtener las gasolineras favoritas', err);
        return throwError(() => new Error(err));
      })
    );
  }

  addFavorite(userId: string, gasStationId: number): Observable<any> {
    const token = localStorage.getItem('access_token');    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { userId, gasStationId };
    return this.http.post(this.urlFavoritesApi + '/add', body, { headers }).pipe(
      catchError(err => {
        console.error('Error al añadir la gasolinera como favorita', err);
        return throwError(() => new Error(err));
      })
    );
  }

  removeFavorite(userId: string, gasStationId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(this.urlFavoritesApi + '/user/' + userId + '/gasStation/' + gasStationId, { headers }).pipe(
      catchError(err => {
        console.error('Error al eliminar la gasolinera favorita', err);
        return throwError(() => new Error(err));
      })
    );
  }

}
