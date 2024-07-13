import {Component, HostListener, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Product} from 'src/app/models/product.model';
import {CartPageService} from 'src/app/services/cart-page.service';
import {WishlistService} from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  constructor(
    private wlService: WishlistService,
    private cservice: CartPageService,
    private snackBarService: MatSnackBar,
    private router: Router
  ) {}
  products: Product[] = [];
  smallPic = false;
  largePic = true;
  progressBar = false;

  ngOnInit(): void {
    this.wlService.WishListChanged.subscribe((res) => {
      if (res) this.products = res;
    });

    if (window.innerWidth < 450) {
      this.smallPic = true;
      this.largePic = false;
    } else {
      this.smallPic = false;
      this.largePic = true;
    }
  }
  addProductToCart(product: Product) {
    this.cservice.addToCart(product, 1);
    // this.router.navigate(['/buying/cart']);
  }
  removeProduct(product: Product) {
    if (confirm('Are you sure you want to remove this product from your wishlist?')) {
      this.progressBar = true;
      this.wlService.removeFromWishList(product.productId).subscribe((res) => {
        if (res === 'Product removed from wishlist') {
          this.wlService.getWishList().subscribe(() => {
            this.progressBar = false;
            this.snackBarService.open('Product removed from wishlist', 'Okay', {duration: 4000});
          });
        }
      });
    }
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
}
