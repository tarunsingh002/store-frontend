import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth-services/auth.service';
import {AutoLoginService} from 'src/app/services/auto-login.service';
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

  constructor(private authS: AuthService, private autoLoginS: AutoLoginService) {}

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
      this.autoLoginS.loggingIn.next(true);
      this.loggingIn = true;
      setTimeout(() => {
        this.authS.signIn('user@gmail.com', 'user1234').subscribe(() => {
          this.loggingIn = false;
          this.autoLoginS.loggingIn.next(false);
        });
      }, autoLoginWait);
    }
  }
}
