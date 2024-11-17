import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthDTO } from 'src/app/Models/auth.dto';
import { AuthService } from 'src/app/Services/auth.service';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';
import { HeaderViewService } from 'src/app/Services/header-view.service';
import { HeaderView } from 'src/app/Models/header-view.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private dialog: MatDialog, 
    private router: Router, 
    private headerMenusService: HeaderViewService
  )
  {
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  login(): void {
    this.authService.login(this.email.value, this.password.value).subscribe(
      (response) => {
        const headerInfo: HeaderView = {
          showAuthSection: true,
          showNoAuthSection: false,
        };
        this.headerMenusService.headerManagement.next(headerInfo);

        localStorage.setItem('user_id', response.user_id);
        localStorage.setItem('access_token', response.access_token);

        const dialogRef = this.dialog.open(NotificationDialogComponent, {
          data: {
            title: 'Inicio de sesión exitoso',
            message: 'El inicio de sesión se ha realizado correctamente.',
            isSuccess: true
          },
          panelClass: ['success-dialog'] 
        });
        setTimeout(() => {
          dialogRef.close();
          window.location.href = '/';
        }, 1000);
      },
      (error) => {
        const headerInfo: HeaderView = {
          showAuthSection: false,
          showNoAuthSection: true,
        };
        this.headerMenusService.headerManagement.next(headerInfo);

        const dialogRef = this.dialog.open(NotificationDialogComponent, {
          data: {
            title: 'Error en el inicio de sesión',
            message: `Ocurrió un error: ${error}`,
            isSuccess: false
          },
          panelClass: ['error-dialog']
        });
        setTimeout(() => dialogRef.close(), 3000);
      }
    );
  }
}
