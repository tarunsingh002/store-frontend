import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {combineLatest} from 'rxjs';
import {delay, map} from 'rxjs/operators';

import {LoadingService} from './loading.service';
import {ProductDataService} from './product-data.service';
import {WishlistService} from './wishlist.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsResolverService {
  constructor(
    private dservice: ProductDataService,
    private l: LoadingService,
    private wlService: WishlistService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.l.isLoading.next(true);

    let category: string;

    if (route.params['category']) {
      category = route.params['category'];
      category = category.toLowerCase().substring(0, category.length - 1);
      return combineLatest([
        this.wlService.getWishListData(),
        this.dservice.getProducts(1, '', 'productId', 'asc', [], [category]),
      ]).pipe(
        map((res) => {
          this.wlService.WishListChanged.next(res[0]);
          this.l.isLoading.next(false);
          return category;
        })
      );
    }

    return combineLatest([this.wlService.getWishListData(), this.dservice.getProducts(1)]).pipe(
      map((res) => {
        this.wlService.WishListChanged.next(res[0]);
        this.l.isLoading.next(false);
        return category;
      })
    );
  }
}
