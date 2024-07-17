import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/services/auth-services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  isLoading = false;
  constructor(
    private authS: AuthService,
    private router: Router,
    private snackbarService: MatSnackBar
  ) {}

  formSubmitted(form: NgForm) {
    console.log(form);
    if (form.invalid) return;
    this.isLoading = true;
    this.authS
      .signUp(form.value.firstName, form.value.lastName, form.value.email, form.value.password)
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.router.navigate(['/products', 'home']);
          this.snackbarService.open(
            'Your details have been registered and you have been signed in',
            'Okay',
            {
              duration: 4000,
              panelClass: 'snackbar-primary',
            }
          );
        },
        (error) => {
          this.isLoading = false;
          this.snackbarService.open(error, 'Okay', {duration: 4000, panelClass: 'snackbar-error'});
        }
      );
  }

  onSwitch() {
    this.router.navigate(['/auth', 'signin']);
  }
}
