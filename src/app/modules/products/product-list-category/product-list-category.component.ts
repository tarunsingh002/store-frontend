import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Product} from '../../../models/product.model';
import {PageEvent} from '@angular/material/paginator';

import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, Subscription, combineLatest} from 'rxjs';
import {concatMap, debounceTime, tap} from 'rxjs/operators';
import {WishlistService} from 'src/app/services/wishlist.service';
import {AuthService} from '../../../services/auth-services/auth.service';
import {CartPageService} from '../../../services/cart-page.service';
import {ProductDataService} from '../../../services/product-data.service';
import {AutoLoginService} from 'src/app/services/auto-login.service';
import {autoLoginWait} from 'src/app/utilities';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list-category',
  templateUrl: './product-list-category.component.html',
  styleUrl: './product-list-category.component.css',
})
export class ProductListCategoryComponent implements OnInit, OnDestroy {
  totalElements: number;
  placeholder: string = '';
  searching: boolean;
  togglingWishlist = false;

  term: string = '';

  searchTermSubject = new Subject<string>();

  loggingIn: boolean;

  products: Product[] = [];
  wishListed: boolean[] = [];
  auth: boolean = false;
  sub: Subscription;
  webmaster: boolean = false;

  // pages: number[] = [];
  isLast: boolean;
  currentPage: number;
  pageChange = false;
  searchTerm = '';
  sortBy = 'productId';
  direction = 'asc';
  sorting: boolean;
  rForm: FormGroup;
  rForm1: FormGroup;
  filtering: boolean;

  brands = [];

  brandfilter = [];
  categoryfilter = [];
  wishlisting: boolean[] = [];
  unwishlisting: boolean[] = [];

  usingFilter1 = false;

  usingSearch = false;
  noOfResults = 0;
  sortByCode = 0;
  pageIndex: number;
  innerWidth: number;
  smallPic = false;
  largePic = true;

  constructor(
    private dservice: ProductDataService,
    private authS: AuthService,
    private cservice: CartPageService,
    private router: Router,
    private wlService: WishlistService,
    private aroute: ActivatedRoute,
    private autoLoginS: AutoLoginService,
    private snackBarService: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    // this.pages = [];
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

        // this.pages = [];
        // for (let i = 0; i < res[0].totalPages; i++) this.pages.push(i + 1);
        this.isLast = res[0].lastPage;
        this.pageIndex = res[0].pageNumber;
        this.currentPage = res[0].pageNumber + 1;
      }

      this.auth = !!res[1];
      if (res[1]) {
        this.webmaster = res[1].webmaster;
      }

      this.wishListed = [];
      this.products.forEach(() => {
        this.wishListed.push(false);
        this.wishlisting.push(false);
        this.unwishlisting.push(false);
      });

      if (this.auth && !this.webmaster && res[2]) {
        res[2].forEach((r) => {
          let index = this.products.findIndex((p) => p.productId === r.productId);
          this.wishListed[index] = true;
        });
      }
    });

    if (window.innerWidth < 650) {
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
        this.authS
          .signIn('user@gmail.com', 'user1234')
          .pipe(
            concatMap(() => this.wlService.getWishList()),
            concatMap(() => this.dservice.getProductById(3))
          )
          .subscribe((res) => {
            this.cservice.addToCart(res, 1);
            this.loggingIn = false;
            this.autoLoginS.loggingIn.next(false);
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

    if (this.aroute.snapshot.data['category']) {
      let category: string = this.aroute.snapshot.data['category'];
      this.categoryfilter = [category];

      if (category === 'mobile')
        this.brands = ['Apple', 'Samsung', 'Huawei', 'HTC', 'Vivo', 'Oppo'];
      else if (category === 'laptop')
        this.brands = ['Apple', 'Dell', 'HP', 'Vaio', 'Samsung', 'Microsoft'];
      else if (category === 'printer')
        this.brands = ['Dell', 'HP', 'Sony', 'Epson', 'Canon', 'Samsung'];

      let formObj = {};

      for (let i = 0; i < this.brands.length; i++) {
        formObj['brand' + (i + 1)] = new FormControl(false);
      }

      this.rForm = new FormGroup(formObj);
    }

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
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 650) {
      this.smallPic = true;
      this.largePic = false;
    } else {
      this.smallPic = false;
      this.largePic = true;
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.currentPage = e.pageIndex + 1;

    this.goToPage(
      this.currentPage,
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
    // console.log(this.products[index]);

    if (confirm('Are you sure you want to delete this product ?'))
      this.dservice.deleteProduct(id).subscribe((response) => {
        if (response === 'Product Deleted') {
          // this.pservice.deleteProduct(id);
          this.dservice
            .getProducts(
              this.currentPage,
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
    // console.log(page);
    this.pageChange = true;
    this.dservice
      .getProducts(page, searchTerm, sortBy, direction, brandfilter, categoryfilter)
      .subscribe(() => {
        this.pageChange = false;
      });
  }
}
