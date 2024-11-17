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

   calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {    
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  addDistance(data: GasStationDTO[], userCoordinates: [number, number]): GasStationDTO[]{
    data.forEach((gasStation) => {
      const dist = this.calculateDistance(
        userCoordinates[0],
        userCoordinates[1],
        gasStation.latitud,
        gasStation.longitud
      );
      gasStation.distance = dist;
    });
    return data;
  }

  calculateTravelTime(distance: number, averageSpeed: number): number {
    if (distance <= 0) {
      return 0;
    }
  
    const timeInHours = distance / averageSpeed;
    const minutes = timeInHours * 60;
  
    return minutes;
  }

  addTravelTime(data: GasStationDTO[]): GasStationDTO[]{
    data.forEach((gasStation) => {
      const time = this.calculateTravelTime(gasStation.distance, 40);
      gasStation.travelTime = time;
    });
    return data;
  }
}
