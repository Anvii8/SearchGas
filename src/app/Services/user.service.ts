import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO } from '../Models/user.dto';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlUsersApi: string;

  constructor(private http: HttpClient) {
    this.urlUsersApi = 'http://localhost:3000/users';  // Entorno de desarrollo
    // this.urlUsersApi = 'https://searchgasbe.onrender.com/users';  // Entorno de producción
  }

  register(user: UserDTO): Observable<UserDTO> {    
    return this.http.post<UserDTO>(this.urlUsersApi, user).pipe(
      tap(response => console.log('Respuesta desde el servidor:', response)),
      catchError(err => {
        console.error('Error al registrar el usuario:', err);
        return throwError(() => new Error(err));
      })
    );
  }  
}