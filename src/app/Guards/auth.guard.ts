import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router ) {}

  canActivate(): boolean{
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
