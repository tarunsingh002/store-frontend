import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {map} from 'rxjs/operators';
import {AdminService} from './admin.service';
import {AuthService} from './auth-services/auth.service';
import {order} from './auth-services/user.service';
import {LoadingService} from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class AllOrdersResolver  {
  constructor(
    private adminService: AdminService,
    private authS: AuthService,
    private l: LoadingService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.l.isLoading.next(true);
    let earnings = 0;
    let orders = [];
    // return this.authS.User.pipe(
    //   take(1),
    //   exhaustMap((user) =>
    // exhaustMap((res: order[]) => {
    return this.adminService.loadAllOrders().pipe(
      map((res: order[]) => {
        earnings = 0;
        res.forEach((r) => {
          let timestamp = new Date(r.timestamp).toDateString();
          let orderTotal = 0;
          r.orderItems.forEach((i) => {
            orderTotal = i.product.price * i.quantity + orderTotal;
          });
          earnings = earnings + orderTotal;
          orders.push({
            timestamp: timestamp,
            total: orderTotal,
            id: r.orderId,
            email: r.user.username,
          });
        });
        console.log(res);
        this.l.isLoading.next(false);
        return {orders: orders, earnings: earnings};
      })
    );
  }
}
