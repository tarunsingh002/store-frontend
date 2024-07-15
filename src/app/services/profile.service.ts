import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {apiUrl} from '../utilities';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {responseData} from './auth-services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  api = apiUrl;

  updateUserInfo(firstName: string, lastName: string) {
    return this.http
      .put(
        `${this.api}/api/v1/user/updateuserinfo`,
        {
          firstName,
          lastName,
        },
        {responseType: 'text'}
      )
      .pipe(catchError(this.handleError));
  }

  updateEmail(email: string) {
    return this.http
      .put<responseData>(`${this.api}/api/v1/user/updateemail`, {
        email,
      })
      .pipe(catchError(this.handleError));
  }

  updatePassword(currentPassword: string, newPassword: string) {
    return this.http
      .put(
        `${this.api}/api/v1/user/updatepassword`,
        {
          currentPassword,
          newPassword,
        },
        {responseType: 'text'}
      )
      .pipe(catchError(this.handleError));
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured';

    console.log(errorRes);

    if (!errorRes.error || typeof errorRes.error !== 'string') return throwError(errorMessage);
    else return throwError(errorRes.error);
  }
}
