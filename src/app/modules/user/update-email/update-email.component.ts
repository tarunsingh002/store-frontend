import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from 'src/app/services/auth-services/auth.service';
import {ProfileService} from 'src/app/services/profile.service';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrl: './update-email.component.css',
})
export class UpdateEmailComponent implements OnInit {
  emailUpdateFormNoChange = true;
  isLoading = false;
  currentEmail: string;
  emailUpdateForm: FormGroup;

  constructor(
    private authS: AuthService,
    private profileS: ProfileService,
    private snackbarService: MatSnackBar
  ) {}

  ngOnInit() {
    this.emailUpdateForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });

    this.authS.User.subscribe((user) => {
      this.currentEmail = user.email;
      this.emailUpdateForm.setValue({
        email: user.email,
      });
    });

    this.emailUpdateForm.valueChanges.subscribe((res) => {
      if (res['email'] === this.currentEmail) this.emailUpdateFormNoChange = true;
      else this.emailUpdateFormNoChange = false;
    });
  }

  onEmailUpdateFormSubmitted(emailUpdateForm: FormGroup, trackSubmission: NgForm) {
    if (emailUpdateForm.invalid || this.emailUpdateFormNoChange) {
      return;
    }

    this.isLoading = true;
    this.profileS.updateEmail(emailUpdateForm.controls.email.value).subscribe(
      (resData) => {
        this.isLoading = false;
        trackSubmission.resetForm();
        this.authS.handleAuthentication(
          resData.id,
          resData.email,
          resData.firstName,
          resData.lastName,
          resData.token,
          resData.refreshToken,
          resData.tokenExpirationTime,
          resData.refreshTokenExpirationTime,
          resData.webmaster
        );

        this.snackbarService.open('Email has been successfully updated', 'Okay', {
          duration: 4000,
          panelClass: 'snackbar-primary',
        });
      },
      (error) => {
        this.isLoading = false;
        this.snackbarService.open(error, 'Okay', {duration: 4000, panelClass: 'snackbar-error'});
      }
    );
  }
}
