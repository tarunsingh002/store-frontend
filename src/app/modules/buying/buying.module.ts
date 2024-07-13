import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BuyProductComponent} from './buy-product/buy-product.component';
import {CartPageComponent} from './cart-page/cart-page.component';
import {CompleteComponent} from './complete/complete.component';
import {OrderComponent} from './order/order.component';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'src/app/services/auth-services/auth.guard';
// import {ProductsResolverService} from 'src/app/services/products-resolver.service';
import {OrderresolverResolver} from './order/orderresolver.resolver';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {OrderDetailsComponent} from './order-details/order-details.component';
import {MatDialogTitle, MatDialogContent} from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';

const routes: Routes = [
  {
    path: 'checkout',
    component: BuyProductComponent,
    // resolve: [ProductsResolverService],
    canActivate: [AuthGuard],
  },
  {
    path: 'complete',
    component: CompleteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    component: OrderComponent,
    resolve: {res2: OrderresolverResolver},
    canActivate: [AuthGuard],
  },
  {
    path: 'cart',
    component: CartPageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    BuyProductComponent,
    CompleteComponent,
    OrderComponent,
    CartPageComponent,
    OrderDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressBarModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogModule,
  ],
})
export class BuyingModule {}
