import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../../models/product.model';
import {AuthService} from '../../../services/auth-services/auth.service';
import {Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';
import {CartPageService} from '../../../services/cart-page.service';
import {WishlistService} from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product = null;
  webmaster = false;
  auth = false;
  sub: Subscription;
  wishlisted: boolean = false;
  quantity = 1;

  constructor(
    private aroute: ActivatedRoute,

    private authS: AuthService,
    private cservice: CartPageService,
    private router: Router,
    private wlService: WishlistService
  ) {}

  ngOnInit(): void {
    this.product = this.aroute.snapshot.data['res'].p;
    this.wishlisted = this.aroute.snapshot.data['res'].w;

    this.authS.User.subscribe((user) => {
      if (user) {
        this.auth = true;
        this.webmaster = user.webmaster;
      }
    });
  }

  addToCart() {
    if (!this.auth || this.webmaster) {
      this.authS.logout();
      this.router.navigate(['/auth/signin']);
      return;
    }

    this.cservice.addToCart(this.product, +this.quantity);
    this.router.navigate(['/buying/cart']);
  }

  addToWishList() {
    this.wlService.addToWishList(this.product).subscribe((res) => {
      if (res === 'Product added to Wishlist') {
        this.wlService.getWishList().subscribe(() => {
          this.wishlisted = true;
        });
      }
    });
  }

  removeFromWishList() {
    this.wlService.removeFromWishList(this.product.productId).subscribe((res) => {
      if (res === 'Product removed from wishlist') {
        this.wlService.getWishList().subscribe(() => {
          this.wishlisted = false;
        });
      }
    });
  }
}
