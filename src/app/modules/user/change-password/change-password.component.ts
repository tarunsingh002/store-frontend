import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ProfileService} from 'src/app/services/profile.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit {
  isLoading = false;
  changePasswordForm: FormGroup;

  constructor(private profilS: ProfileService, private snackbarService: MatSnackBar) {}

  ngOnInit() {
    this.changePasswordForm = new FormGroup(
      {
        currentPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        newPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      },
      [this.passwordsMustBeUnequal]
    );
  }
  passwordsMustBeUnequal(control: AbstractControl) {
    let currentPassword = control.get('currentPassword').value;
    let newPassword = control.get('newPassword').value;

    if (currentPassword !== newPassword) return null;
    else return {currentAndNewPasswordSame: true};
  }

  onChangePasswordFormSubmitted(changePasswordForm: FormGroup, trackSubmission: NgForm) {
    // console.log(changePasswordForm);
    // console.log(trackSubmission);

    if (changePasswordForm.invalid) return;

    this.isLoading = true;

    this.profilS
      .updatePassword(
        changePasswordForm.controls.currentPassword.value,
        changePasswordForm.controls.newPassword.value
      )
      .subscribe(
        (res) => {
          trackSubmission.resetForm();
          this.isLoading = false;
          this.snackbarService.open(res, 'Okay', {
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
