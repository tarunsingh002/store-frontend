import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [LoadingSpinnerComponent],
  imports: [CommonModule, MatProgressBarModule],
  exports: [LoadingSpinnerComponent],
})
export class SharedModule {}
