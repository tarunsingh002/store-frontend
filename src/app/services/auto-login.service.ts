import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutoLoginService {
  loggingIn = new Subject<boolean>();

  constructor() {}
}
