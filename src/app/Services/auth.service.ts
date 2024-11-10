import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

export interface AuthToken {
  user_id: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlAuthApi: string;

  constructor(private http: HttpClient) {
    //this.urlAuthApi = 'http://localhost:3000/auth';  // Entorno de desarrollo
    this.urlAuthApi = 'https://searchgasbe.onrender.com/auth';  // Entorno de producción
  }

  login(email: string, password: string): Observable<AuthToken> {
    const auth = {email: email, password: password};
    return this.http.post<AuthToken>(this.urlAuthApi, auth).pipe(
      tap(response => console.log('Respuesta desde el servidor:', response)),
      catchError(err => {
        console.error('Error al registrar el usuario:', err);        
        return throwError(() => new Error(err.statusText));
      })
    );
  }

}
