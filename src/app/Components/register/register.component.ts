import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserDTO } from 'src/app/Models/user.dto';
import { UserService } from 'src/app/Services/user.service';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerUser: UserDTO;

  name: FormControl;
  surname: FormControl;
  email: FormControl;
  password: FormControl;
  privacyPolicy: FormControl;

  registerForm: FormGroup;
  isValidForm: boolean | null;
  submitted: boolean;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private dialog: MatDialog, private router: Router) {
    this.registerUser = new UserDTO('', '', '', '');

    this.isValidForm = null;
    this.submitted = false;

    this.name = new FormControl(this.registerUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.surname = new FormControl(this.registerUser.surname, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.email = new FormControl(this.registerUser.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new FormControl(this.registerUser.password, [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.privacyPolicy = new FormControl(false, [Validators.requiredTrue]);

    this.registerForm = this.formBuilder.group({
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      privacyPolicy: this.privacyPolicy,
    });
  }

  register(): void {
    this.submitted = true;
    this.isValidForm = false;

    if (this.registerForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.registerUser = this.registerForm.value;

    const user: UserDTO = {
      name: this.registerUser.name,
      surname: this.registerUser.surname,
      email: this.registerUser.email,
      password: this.registerUser.password,
    };

    this.userService.register(user).subscribe({
      next: () => {
        const dialogRef = this.dialog.open(NotificationDialogComponent, {
          data: {
            title: 'Registro exitoso',
            message: 'El registro se ha realizado correctamente.',
            isSuccess: true
          },
          panelClass: ['success-dialog'] 
        });
        setTimeout(() => {
          dialogRef.close();
          this.router.navigateByUrl('login');
        }, 3000);
      },
      error: (err) => {
        const dialogRef = this.dialog.open(NotificationDialogComponent, {
          data: {
            title: 'Error en el registro',
            message: `Ocurrió un error: ${err.message}`,
            isSuccess: false
          },
          panelClass: ['error-dialog']
        });
        setTimeout(() => dialogRef.close(), 3000);
      }
    });
  }

}
