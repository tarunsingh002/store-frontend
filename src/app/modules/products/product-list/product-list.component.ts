import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Product} from '../../../models/product.model';
import {PageEvent} from '@angular/material/paginator';

import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Subject, Subscription, combineLatest} from 'rxjs';
import {debounceTime, tap} from 'rxjs/operators';
import {WishlistService} from 'src/app/services/wishlist.service';
import {AuthService} from '../../../services/auth-services/auth.service';
import {CartPageService} from '../../../services/cart-page.service';
import {ProductDataService} from '../../../services/product-data.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AutoLoginService} from 'src/app/services/auto-login.service';
import {autoLoginWait} from 'src/app/utilities';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  togglingWishlist = false;
  totalElements: number;
  placeholder: string = '';
  searching: boolean;
  term: string = '';

  searchTermSubject = new Subject<string>();

  loggingIn: boolean;

  products: Product[] = [];
  wishListed: boolean[] = [];
  auth: boolean = false;
  sub: Subscription;
  webmaster: boolean = false;

  pageChange = false;
  searchTerm = '';
  sortBy = 'productId';
  direction = 'asc';
  sorting: boolean;
  rForm: FormGroup;
  rForm1: FormGroup;
  filtering: boolean;

  brands = ['Apple', 'Dell', 'HP', 'Vaio', 'Samsung', 'Huawei', 'Sony', 'HTC', 'Vivo', 'Oppo'];
  categories = [
    'Phone',
    'Laptop',
    'Camera',
    'Tablet',
    'Gaming Console',
    'Printer',
    'Monitor',
    'Mouse',
  ];

  brandfilter = [];
  categoryfilter = [];
  // wishlisting: boolean[] = [];
  // unwishlisting: boolean[] = [];

  usingFilter1 = false;
  usingFilter2 = false;
  usingSearch = false;
  noOfResults = 0;
  sortByCode = 0;
  pageIndex: number;
  smallPic: boolean;
  largePic: boolean;

  constructor(
    private dservice: ProductDataService,
    private authS: AuthService,
    private cservice: CartPageService,
    private router: Router,
    private wlService: WishlistService,
    private snackBarService: MatSnackBar,
    private autoLoginS: AutoLoginService
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = combineLatest([
      this.dservice.productResponseChanged,
      this.authS.User,
      this.wlService.WishListChanged,
    ]).subscribe((res) => {
      if (res[0].products) {
        this.totalElements = res[0].totalElements;
        this.products = res[0].products;
        this.noOfResults = res[0].totalElements;
        this.pageIndex = res[0].pageNumber;
      }

      this.auth = !!res[1];
      if (res[1]) {
        this.webmaster = res[1].webmaster;
      }

      this.wishListed = [];
      this.products.forEach(() => {
        this.wishListed.push(false);
      });

      if (this.auth && !this.webmaster && res[2]) {
        res[2].forEach((r) => {
          let index = this.products.findIndex((p) => p.productId === r.productId);
          this.wishListed[index] = true;
        });
      }
    });

    if (window.innerWidth < 450) {
      this.smallPic = true;
      this.largePic = false;
    } else {
      this.smallPic = false;
      this.largePic = true;
    }

    if (!this.auth) {
      this.loggingIn = true;
      this.autoLoginS.loggingIn.next(true);
      setTimeout(() => {
        this.authS.signIn('user@gmail.com', 'user1234').subscribe(() => {
          this.wlService.getWishList().subscribe(() => {
            this.loggingIn = false;
            this.autoLoginS.loggingIn.next(false);
          });
        });
      }, autoLoginWait);
    }

    this.searchTermSubject
      .pipe(
        tap(() => {
          this.searching = true;
        }),
        debounceTime(1500)
      )
      .subscribe((term: string) => {
        this.searchTerm = term.trim();
        this.dservice
          .getProducts(
            1,
            this.searchTerm,
            this.sortBy,
            this.direction,
            this.brandfilter,
            this.categoryfilter
          )
          .subscribe(() => {
            this.searching = false;
            if (this.searchTerm === '') this.usingSearch = false;
            else this.usingSearch = true;
          });
      });

    this.rForm = new FormGroup({
      brand1: new FormControl(false),
      brand2: new FormControl(false),
      brand3: new FormControl(false),
      brand4: new FormControl(false),
      brand5: new FormControl(false),
      brand6: new FormControl(false),
      brand7: new FormControl(false),
      brand8: new FormControl(false),
      brand9: new FormControl(false),
      brand10: new FormControl(false),
    });

    this.rForm.valueChanges.subscribe((brandsboolean) => {
      this.filtering = true;

      let i = 0;
      this.brandfilter = [];

      for (const key in brandsboolean) {
        if (brandsboolean.hasOwnProperty(key)) {
          if (brandsboolean[key]) {
            this.brandfilter.push(this.brands[i]);
          }
          i++;
        }
      }

      this.dservice
        .getProducts(
          1,
          this.searchTerm,
          this.sortBy,
          this.direction,
          this.brandfilter,
          this.categoryfilter
        )
        .subscribe(() => {
          this.filtering = false;
          if (!this.brandfilter.length) this.usingFilter1 = false;
          else this.usingFilter1 = true;
        });
    });

    this.rForm1 = new FormGroup({
      category1: new FormControl(false),
      category2: new FormControl(false),
      category3: new FormControl(false),
      category4: new FormControl(false),
      category5: new FormControl(false),
      category6: new FormControl(false),
      category7: new FormControl(false),
      category8: new FormControl(false),
    });

    this.rForm1.valueChanges.subscribe((categoriesboolean) => {
      this.filtering = true;

      let i = 0;
      this.categoryfilter = [];

      for (const key in categoriesboolean) {
        if (categoriesboolean.hasOwnProperty(key)) {
          if (categoriesboolean[key]) {
            this.categoryfilter.push(this.categories[i]);
          }
          i++;
        }
      }

      this.dservice
        .getProducts(
          1,
          this.searchTerm,
          this.sortBy,
          this.direction,
          this.brandfilter,
          this.categoryfilter
        )
        .subscribe(() => {
          this.filtering = false;
          if (!this.categoryfilter.length) this.usingFilter2 = false;
          else this.usingFilter2 = true;
        });
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 450) {
      this.smallPic = true;
      this.largePic = false;
    } else {
      this.smallPic = false;
      this.largePic = true;
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;

    this.goToPage(
      this.pageIndex + 1,
      this.searchTerm,
      this.sortBy,
      this.direction,
      this.brandfilter,
      this.categoryfilter
    );
  }

  onSortingChange() {
    console.log(this.sortByCode);
    this.sorting = true;
    switch (this.sortByCode) {
      case 0:
        this.sortBy = 'productId';
        this.direction = 'asc';
        break;

      case 1:
        this.sortBy = 'price';
        this.direction = 'desc';
        break;

      case 2:
        this.sortBy = 'price';
        this.direction = 'asc';
        break;

      case 3:
        this.sortBy = 'name';
        this.direction = 'asc';
        break;

      case 4:
        this.sortBy = 'name';
        this.direction = 'desc';
        break;
    }
    this.dservice
      .getProducts(
        1,
        this.searchTerm,
        this.sortBy,
        this.direction,
        this.brandfilter,
        this.categoryfilter
      )
      .subscribe(() => {
        this.sorting = false;
      });
  }

  searchTermDeleted() {
    this.term = '';
    this.searchTermChanged();
  }

  searchTermChanged() {
    this.searchTermSubject.next(this.term.trim());
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this product ?'))
      this.dservice.deleteProduct(id).subscribe((response) => {
        if (response === 'Product Deleted') {
          this.dservice
            .getProducts(
              this.pageIndex + 1,
              this.searchTerm,
              this.sortBy,
              this.direction,
              this.brandfilter,
              this.categoryfilter
            )
            .subscribe();
        }
      });
  }

  addToCart(p: Product) {
    if (!this.auth) {
      this.router.navigate(['/auth']);
      return;
    }
    this.cservice.addToCart(p, 1);
    this.snackBarService.open('An item of this product was added to cart', 'Great!', {
      duration: 4000,
      panelClass: 'snackbar-primary',
    });
    // this.router.navigate(['/buying/cart']);
  }

  addToWishList(index: number) {
    this.togglingWishlist = true;
    this.wlService.addToWishList(this.products[index]).subscribe((res) => {
      if (res === 'Product added to Wishlist') {
        this.wlService.getWishList().subscribe(() => {
          this.togglingWishlist = false;
          this.snackBarService.open('Product added to wishlist', 'Great!', {
            duration: 4000,
            panelClass: 'snackbar-primary',
          });
        });
      }
    });
  }

  removeFromWishList(index: number) {
    this.togglingWishlist = true;
    this.wlService.removeFromWishList(this.products[index].productId).subscribe((res) => {
      if (res === 'Product removed from wishlist') {
        this.wlService.getWishList().subscribe(() => {
          this.togglingWishlist = false;
          this.snackBarService.open('Product removed from wishlist', 'Okay', {
            duration: 4000,
            panelClass: 'snackbar-primary',
          });
        });
      }
    });
  }

  goToPage(
    page: number,
    searchTerm: string,
    sortBy: string,
    direction: string,
    brandfilter: any[],
    categoryfilter: any[]
  ) {
    this.pageChange = true;
    this.dservice
      .getProducts(page, searchTerm, sortBy, direction, brandfilter, categoryfilter)
      .subscribe(() => {
        this.pageChange = false;
      });
  }
}
