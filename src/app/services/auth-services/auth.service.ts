import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, throwError} from 'rxjs';
import {User} from '../../models/user.model';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {apiUrl} from 'src/app/utilities';
import {CartPageService} from '../cart-page.service';

export interface responseData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  refreshToken: string;
  tokenExpirationTime: number;
  refreshTokenExpirationTime: number;
  webmaster: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cartPageService: CartPageService
  ) {}

  tokenExpirationTimer;
  refreshTokenExpirationTimer;
  signUpMode: boolean = false;

  User = new BehaviorSubject<User>(null);

  signUp(firstName: string, lastName: string, email: string, password: string) {
    const url = `${apiUrl}/api/v1/auth/signup`;

    return this.http
      .post<responseData>(url, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          // this.signUpMode = true;
          this.handleAuthentication(
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
        })
      );
  }

  signIn(email: string, password: string) {
    const url = `${apiUrl}/api/v1/auth/signin`;

    return this.http
      .post<responseData>(url, {
        email: email,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.signUpMode = false;
          this.handleAuthentication(
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
        })
      );
  }

  updateUserInfoWithoutReauthentication(user: User) {
    this.User.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  handleAuthentication(
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    token: string,
    refreshToken: string,
    tokenExpirationTime: number,
    refreshTokenExpirationTime: number,
    webmaster: boolean
  ) {
    const tokenExpirationDate = new Date(tokenExpirationTime);
    const refreshTokenExpirationDate = new Date(refreshTokenExpirationTime);
    const user = new User(
      id,
      firstName,
      lastName,
      email,
      token,
      tokenExpirationDate,
      refreshToken,
      refreshTokenExpirationDate,
      webmaster
    );
    this.User.next(user);
    this.autoLogout(refreshTokenExpirationTime);
    this.autoRefresh(user, token, refreshToken, tokenExpirationTime, refreshTokenExpirationTime);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoRefresh(
    user: User,
    token: string,
    refreshToken: string,
    tokenExpirationTime: number,
    refreshTokenExpirationTime: number
  ) {
    if (refreshTokenExpirationTime > Date.now()) {
      this.tokenExpirationTimer = setTimeout(() => {
        this.autoRefreshHttp(token, refreshToken).subscribe((res) => {
          user = new User(
            user.id,
            user.firstName,
            user.lastName,
            user.email,
            res.token,
            new Date(res.tokenExpirationTime),
            user.refreshToken,
            new Date(refreshTokenExpirationTime),
            user.webmaster
          );
          this.User.next(user);
          localStorage.setItem('userData', JSON.stringify(user));
          this.autoRefresh(
            user,
            user.token,
            user.refreshToken,
            res.tokenExpirationTime,
            refreshTokenExpirationTime
          );
        });
      }, tokenExpirationTime - Date.now());
    } else this.logout();
  }

  autoRefreshHttp(token: string, refreshToken: string) {
    return this.http.post<responseData>(`${apiUrl}/api/v1/auth/refresh`, {
      token: token,
      refreshToken: refreshToken,
    });
  }

  autoLogout(expiresIn: number) {
    this.refreshTokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiresIn - Date.now());
  }

  logout() {
    this.router.navigate(['/auth', 'signin']);
    this.User.next(null);
    this.cartPageService.cartChanged.next(null);
    this.cartPageService.cart = [];
    localStorage.removeItem('userData');
    localStorage.removeItem('cart');
    if (this.refreshTokenExpirationTimer) {
      clearTimeout(this.refreshTokenExpirationTimer);
    }
    this.refreshTokenExpirationTimer = null;

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const obj = JSON.parse(localStorage.getItem('userData'));
    const obj2 = JSON.parse(localStorage.getItem('cart'));

    if (!obj2) this.cartPageService.cartChanged.next(null);
    else {
      this.cartPageService.cartChanged.next(obj2);
      this.cartPageService.cart = obj2;
    }

    if (!obj) return;

    const loadedUser = new User(
      obj.id,
      obj.firstName,
      obj.lastName,
      obj.email,
      obj._token,
      new Date(obj._tokenExpirationDate),
      obj._refreshToken,
      new Date(obj._refreshTokenExpirationDate),
      obj.webmaster
    );

    if (loadedUser.refreshToken) {
      this.User.next(loadedUser);
      const tokenExpirationTime = new Date(obj._tokenExpirationDate).getTime();
      const refreshTokenExpirationTime = new Date(obj._refreshTokenExpirationDate).getTime();
      this.autoRefresh(
        loadedUser,
        loadedUser.token,
        loadedUser.refreshToken,
        tokenExpirationTime,
        refreshTokenExpirationTime
      );
      this.autoLogout(refreshTokenExpirationTime);
    }
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured';

    console.log(errorRes);

    if (!errorRes.error || typeof errorRes.error !== 'string') return throwError(errorMessage);
    else return throwError(errorRes.error);
  }
}
