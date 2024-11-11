import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  private apiUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=';
  private reverseApiUrl = 'https://nominatim.openstreetmap.org/reverse?format=json';

  constructor(private http: HttpClient) {}

  getCoordinates(location: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${encodeURIComponent(location)}`);
  }

  getLocationFromCoordinates(coordinates: [number, number]): Observable<any> {
    const latitude: number = coordinates[0];
    const longitude: number = coordinates[1];
    return this.http.get<any>(`${this.reverseApiUrl}&lat=${latitude}&lon=${longitude}`);
  }
}
