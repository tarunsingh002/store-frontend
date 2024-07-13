import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Cart} from '../../../models/cart.model';
import {CartPageService} from '../../../services/cart-page.service';
import {Product} from '../../../models/product.model';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit, OnDestroy {
  cart: Cart[];
  displayCart: {product: Product; quantity: number}[];
  cartTotal = 0;
  cartItems = 0;
  cartSub: Subscription;
  loadingCheckout = false;
  smallPic = false;
  largePic = true;

  constructor(private cservice: CartPageService, private router: Router) {}

  ngOnInit(): void {
    this.cartSub = this.cservice.cartChanged.subscribe((cart) => {
      if (!localStorage.getItem('cart') && !cart) {
        this.cart = [];
      } else if (localStorage.getItem('cart') && !cart) {
        this.cart = JSON.parse(localStorage.getItem('cart'));
      } else if (!localStorage.getItem('cart') && cart) {
        this.cart = cart;
      } else if (localStorage.getItem('cart') && cart) {
        this.cart = cart;
      }

      let t: number = 0;
      let items = 0;

      for (let i = 0; i < this.cart.length; i++) {
        t += this.cart[i].product.price * this.cart[i].quantity;
        items += this.cart[i].quantity;
      }

      this.cartTotal = t;
      this.cartItems = items;
    });

    if (window.innerWidth < 450) {
      this.smallPic = true;
      this.largePic = false;
    } else {
      this.smallPic = false;
      this.largePic = true;
    }
  }

  addProduct(p: {product: Product; quantity: number}) {
    let i = this.cart.findIndex((pd) => pd.product.productId === p.product.productId);

    this.cart[i].quantity++;
    this.cservice.editCart(this.cart);
  }

  subtractProduct(p: {product: Product; quantity: number}) {
    let i = this.cart.findIndex((pd) => pd.product.productId === p.product.productId);

    if (this.cart[i].quantity === 1)
      if (!confirm('Are you sure you want to remove this product from your cart?')) return;

    this.cart[i].quantity--;
    if (this.cart[i].quantity === 0) {
      this.cart.splice(i, 1);
    }
    this.cservice.editCart(this.cart);
  }

  proceedToCheckout() {
    this.loadingCheckout = true;

    setTimeout(() => {
      this.router.navigate(['/buying/checkout']);
    }, 3100);
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

  ngOnDestroy(): void {
    this.cartSub.unsubscribe();
  }
}
