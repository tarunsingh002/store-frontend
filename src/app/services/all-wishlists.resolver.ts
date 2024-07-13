import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {Product} from '../models/product.model';
import {AdminService} from './admin.service';
import {LoadingService} from './loading.service';
import {ProductDataService} from './product-data.service';

@Injectable({
  providedIn: 'root',
})
export class AllWishlistsResolver  {
  constructor(
    private adminService: AdminService,
    private dService: ProductDataService,
    private l: LoadingService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let Products = [];
    let wishlisted = [];
    this.l.isLoading.next(true);

    return combineLatest([this.dService.getProducts(0), this.adminService.getAllWishlisted()]).pipe(
      map((res) => {
        wishlisted = [];
        res[0].products.forEach((p) => {
          wishlisted.push(0);
        });
        res[1].forEach((r) => {
          r.products.forEach((listp) => {
            let index = res[0].products.findIndex((p) => p.productId === listp.productId);
            if (index !== -1) {
              wishlisted[index]++;
            }
          });
        });
        Products = res[0].products;
        Products.sort((p1, p2) => {
          let index1 = res[0].products.findIndex((p) => p.productId === p1.productId);
          let index2 = res[0].products.findIndex((p) => p.productId === p2.productId);
          return wishlisted[index2] - wishlisted[index1];
        });
        wishlisted.sort((lt1, lt2) => {
          return lt2 - lt1;
        });
        console.log(res);
        this.l.isLoading.next(false);
        return {products: Products, wishlisted: wishlisted};
      })
    );

    // return this.dService.getProducts(0).pipe(
    //   exhaustMap((productResponse) =>
    //     this.adminService.getAllWishlisted().pipe(
    //       exhaustMap((res: wishlist[]) => {
    //         wishlisted = [];
    //         productResponse.products.forEach((p) => {
    //           wishlisted.push(0);
    //         });
    //         res.forEach((r) => {
    //           r.products.forEach((listp) => {
    //             let index = productResponse.products.findIndex(
    //               (p) => p.productId === listp.productId
    //             );
    //             if (index !== -1) {
    //               wishlisted[index]++;
    //             }
    //           });
    //         });
    //         Products = productResponse.products;
    //         Products.sort((p1, p2) => {
    //           let index1 = productResponse.products.findIndex((p) => p.productId === p1.productId);
    //           let index2 = productResponse.products.findIndex((p) => p.productId === p2.productId);
    //           return wishlisted[index2] - wishlisted[index1];
    //         });
    //         wishlisted.sort((lt1, lt2) => {
    //           return lt2 - lt1;
    //         });
    //         console.log(res);
    //         this.l.isLoading.next(false);
    //         return of({products: Products, wishlisted: wishlisted});
    //       })
    //     )
    //   )
    // );
  }
}
