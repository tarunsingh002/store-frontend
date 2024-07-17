import {Component} from '@angular/core';
import {AuthService} from '../../../services/auth-services/auth.service';
import {NgForm} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Router} from '@angular/router';
import {concatMap} from 'rxjs/operators';
import {ProductDataService} from 'src/app/services/product-data.service';
import {CartPageService} from 'src/app/services/cart-page.service';

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
    private snackBarService: MatSnackBar,
    private dservice: ProductDataService,
    private cservice: CartPageService
  ) {}

  formSubmitted(form: NgForm) {
    console.log(form);
    if (form.invalid) return;
    this.isLoading = true;
    this.authS.signIn(form.value.email, form.value.password).subscribe(
      (res) => {
        this.isLoading = false;
        this.router.navigate(['/products', 'home']);
        this.snackBarService.open('You have successfully signed in', 'Okay', {
          duration: 4000,
          panelClass: 'snackbar-primary',
        });
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
    this.authS
      .signIn('user@gmail.com', 'user1234')
      .pipe(concatMap(() => this.dservice.getProductById(3)))
      .subscribe((res) => {
        this.snackBarService.open('You have successfully signed in', 'Okay', {
          duration: 4000,
          panelClass: 'snackbar-primary',
        });
        this.router.navigate(['/products', 'home']);
        this.cservice.addToCart(res, 1);
        this.isLoading = false;
      });
  }

  onSwitch() {
    this.router.navigate(['/auth', 'signup']);
  }
}
