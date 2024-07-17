import {Component, OnInit} from '@angular/core';
import {concatMap} from 'rxjs/operators';
import {AuthService} from 'src/app/services/auth-services/auth.service';
import {AutoLoginService} from 'src/app/services/auto-login.service';
import {CartPageService} from 'src/app/services/cart-page.service';
import {ProductDataService} from 'src/app/services/product-data.service';
import {autoLoginWait} from 'src/app/utilities';
import {carousel} from 'src/data/CarouselData';
import {data} from 'src/data/FrontPageData';

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css',
})
export class FrontPageComponent implements OnInit {
  slides = carousel;
  data = data;
  auth = false;
  loggingIn = false;

  slide = 0;
  j = 0;

  constructor(
    private authS: AuthService,
    private autoLoginS: AutoLoginService,
    private cservice: CartPageService,
    private dservice: ProductDataService
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      if (this.slide + 1 < this.slides.length) this.slide++;
      else this.slide = 0;
      this.j = -100 * this.slide;
    }, 2000);

    this.authS.User.subscribe((user) => {
      this.auth = !!user;
    });

    if (!this.auth) {
      this.loggingIn = true;
      this.autoLoginS.loggingIn.next(true);
      setTimeout(() => {
        this.authS
          .signIn('user@gmail.com', 'user1234')
          .pipe(concatMap(() => this.dservice.getProductById(3)))
          .subscribe((res) => {
            this.cservice.addToCart(res, 1);
            this.loggingIn = false;
            this.autoLoginS.loggingIn.next(false);
          });
      }, autoLoginWait);
    }
  }
}
