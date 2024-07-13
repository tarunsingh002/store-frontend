import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from 'src/app/models/user.model';
import {AuthService} from 'src/app/services/auth-services/auth.service';
import {ProfileService} from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  isLoading = false;
  profileForm: FormGroup;
  currentUserDetails: User;
  // currentFirstName: string;
  // currentLastName: string;
  profileFormNoChange = true;

  constructor(
    private authS: AuthService,
    private profileS: ProfileService,
    private snackbarService: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    });

    this.authS.User.subscribe((user) => {
      this.currentUserDetails = user;
      this.profileForm.setValue({
        firstName: user.firstName,
        lastName: user.lastName,
      });
    });

    this.profileForm.valueChanges.subscribe((res) => {
      if (
        res['firstName'] === this.currentUserDetails.firstName &&
        res['lastName'] === this.currentUserDetails.lastName
      )
        this.profileFormNoChange = true;
      else this.profileFormNoChange = false;
    });
  }

  onProfileFormSubmitted(profileForm: FormGroup, trackSubmission: NgForm) {
    // console.log(profileForm);
    // console.log(trackSubmission);

    if (this.profileForm.invalid || this.profileFormNoChange) {
      return;
    }

    let newFirstName = profileForm.controls.firstName.value;
    let newLastName = profileForm.controls.lastName.value;

    this.isLoading = true;
    this.profileS.updateUserInfo(newFirstName, newLastName).subscribe({
      next: (resData) => {
        trackSubmission.resetForm();

        let newUserDetails = new User(
          this.currentUserDetails.id,
          newFirstName,
          newLastName,
          this.currentUserDetails.email,
          this.currentUserDetails.token,
          this.currentUserDetails.tokenExpirationDate,
          this.currentUserDetails.refreshToken,
          this.currentUserDetails.refreshTokenExpirationDate,
          this.currentUserDetails.webmaster
        );

        this.authS.updateUserInfoWithoutReauthentication(newUserDetails);

        this.isLoading = false;
        this.snackbarService.open(resData, 'Okay', {
          duration: 4000,
          panelClass: 'snackbar-primary',
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.snackbarService.open(error, 'Okay', {duration: 4000, panelClass: 'snackbar-error'});
      },
    });
  }
}
