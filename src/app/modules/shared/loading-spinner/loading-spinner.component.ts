import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css'],
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  wakingUpTheServerSideCode = false;
  timer;

  ngOnInit(): void {
    this.timer = setTimeout(() => {
      this.wakingUpTheServerSideCode = true;
    }, 3700);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
