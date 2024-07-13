import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
// import {User} from '../../../models/user.model';
import {AuthService} from '../../../services/auth-services/auth.service';
import {OrderItem, UserService, order} from '../../../services/auth-services/user.service';
// import {CartPageService} from '../../../services/cart-page.service';
import {LoadingService} from '../../../services/loading.service';
// import {ProductDataService} from '../../../services/product-data.service';

export interface DisplayCart {
  timestamp: string;
  deliveryTimestamp: string;
  deliveredStatus: boolean;
  orderItems: OrderItem[];
  orderId: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderresolverResolver {
  constructor(
    private aservice: AuthService,
    private uservice: UserService,
    private l: LoadingService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.l.isLoading.next(true);

    return this.aservice.User.pipe(
      switchMap((user) => {
        if (user) {
          return this.uservice.loadUserOrders().pipe(
            switchMap((res: order[]) => {
              if (res) {
                this.l.isLoading.next(false);
                return of({
                  user: user,
                  res: res,
                });
              } else {
                this.l.isLoading.next(false);
                return of({user: user, res: []});
              }
            })
          );
        } else {
          this.l.isLoading.next(false);
          return of({user: null, res: []});
        }
      })
    );
  }
}
