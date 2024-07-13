import {Component} from '@angular/core';
import {AuthService} from '../../../services/auth-services/auth.service';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  isLoading = false;
  constructor(
    private authS: AuthService,
    private router: Router,
    private snackBarService: MatSnackBar
  ) {}

  formSubmitted(form: NgForm) {
    console.log(form);
    if (form.invalid) return;
    this.isLoading = true;
    this.authS.signIn(form.value.email, form.value.password).subscribe(
      (res) => {
        this.isLoading = false;
        this.router.navigate(['/products', 'home']);
      },
      (error) => {
        this.isLoading = false;
        this.snackBarService.open(error, 'Okay', {duration: 4000, panelClass: 'snackbar-error'});

        // form.reset();
      }
    );
  }

  loginWithTestCredentials() {
    this.isLoading = true;
    this.authS.signIn('user@gmail.com', 'user1234').subscribe(
      (res) => {
        this.isLoading = false;
        this.router.navigate(['/products', 'home']);
      },
      (error) => {
        this.isLoading = false;
        this.snackBarService.open(error, 'Okay', {duration: 4000, panelClass: 'snackbar-error'});
      }
    );
  }

  onSwitch() {
    this.router.navigate(['/auth', 'signup']);
  }
}
