import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoadingService} from './services/loading.service';
import {Subscription} from 'rxjs';
import {AuthService} from './services/auth-services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = false;

  loadingSub: Subscription;

  constructor(private l: LoadingService, private authS: AuthService) {}

  ngOnInit() {
    this.authS.autoLogin();
    this.loadingSub = this.l.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
  }
}
