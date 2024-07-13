import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {FeedbackService} from 'src/app/services/feedback.service';
import {LoadingService} from 'src/app/services/loading.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent {
  constructor(
    private l: LoadingService,
    private fService: FeedbackService,
    private router: Router
  ) {}

  onSubmit(f: NgForm) {
    let value = f.value;
    if (f.controls.feedback.invalid) return;
    this.l.isLoading.next(true);

    this.fService
      .recordFeedback({companyName: value.name, feedback: value.feedback})
      .subscribe(() => {
        this.l.isLoading.next(false);
        this.router.navigate(['miscellaneous/recorded']);
      });
  }
}
