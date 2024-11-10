import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderView } from 'src/app/Models/header-view.dto';
import { HeaderViewService } from 'src/app/Services/header-view.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showAuthSection: boolean;
  showNoAuthSection: boolean;
  userName: string = "";

  constructor(private router: Router, private headerMenusService: HeaderViewService, private userService: UserService){
    this.showAuthSection = false;
    this.showNoAuthSection = true;
  }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderView) => {
        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection;
          this.showNoAuthSection = headerInfo.showNoAuthSection;
        }
      }
    ); 
  }

  checkLoginStatus(): void {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
  
    if (token && userId) {
      this.headerMenusService.headerManagement.next({
        showAuthSection: true,
        showNoAuthSection: false,
      });
      this.getUsernameById();
    } else {
      this.headerMenusService.headerManagement.next({
        showAuthSection: false,
        showNoAuthSection: true,
      });
    }
  }

  login(): void {
    this.router.navigateByUrl('login');
  }

  register(): void {
    this.router.navigateByUrl('register');
  }

  favorites(): void {
    this.router.navigateByUrl('favorites');
  }

  logout(): void {
    localStorage.removeItem("user_id");
    localStorage.removeItem("access_token");

    const headerInfo: HeaderView = {
      showAuthSection: false,
      showNoAuthSection: true,
    };
    this.headerMenusService.headerManagement.next(headerInfo);

    this.router.navigateByUrl('home');
  }

  getUsernameById(): void {
    const user_id = localStorage.getItem("user_id");
    if (user_id) {
      this.userService.getUserById(user_id).subscribe(
        (response) => {
          if (response && response.name) {
            this.userName = response.name;
          }
        },
        (error) => {
          console.error('Error al obtener el nombre del usuario', error);
        }
      );
    } else {
      console.warn('No se encontró el ID del usuario en localStorage');
    }
  }
  

}
