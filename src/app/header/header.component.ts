import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../services/auth-services/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import {CartPageService} from '../services/cart-page.service';
import {AutoLoginService} from '../services/auto-login.service';
import {Subscription} from 'rxjs';
import {Cart} from '../models/cart.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  auth = false;
  webmaster = false;
  userSub: Subscription;
  autoLoginSub: Subscription;
  loadedAuthPage: boolean;
  routerSub: Subscription;
  cSub: Subscription;
  items: number;
  loggingIn = false;
  firstName: string;

  constructor(
    private authS: AuthService,
    private router: Router,
    private cservice: CartPageService,
    private autoLoginS: AutoLoginService
  ) {}

  ngOnInit() {
    this.userSub = this.authS.User.subscribe((user) => {
      this.auth = !!user;
      if (user) {
        this.webmaster = user.webmaster;
        this.firstName = user.firstName;
      } else this.webmaster = false;
    });

    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd)
        this.loadedAuthPage = this.router.url.includes('/auth') ? true : false;
    });

    this.cSub = this.cservice.cartChanged.subscribe((c) => {
      if (!c) this.items = 0;
      else this.items = c.reduce((t: number, i: Cart) => (t = t + i.quantity), 0);
    });

    this.autoLoginSub = this.autoLoginS.loggingIn.subscribe((b) => {
      this.loggingIn = b;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.routerSub.unsubscribe();
    this.cSub.unsubscribe();
    this.autoLoginSub.unsubscribe();
  }

  onLogout() {
    this.authS.logout();
  }

  onLoginRegister() {
    this.router.navigate(['/auth', 'signin']);
  }
}
