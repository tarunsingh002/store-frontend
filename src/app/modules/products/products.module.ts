import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {ProductFormComponent} from './product-form/product-form.component';
import {ProductListComponent} from './product-list/product-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {ProductsResolverService} from 'src/app/services/products-resolver.service';
import {IsWebmasterGuard} from 'src/app/services/auth-services/is-webmaster.guard';
import {AuthGuard} from 'src/app/services/auth-services/auth.guard';
import {WishlistComponent} from './wishlist/wishlist.component';

import {ProductDetailsResolver} from 'src/app/services/product-details.resolver';
import {WishlistResolver} from 'src/app/services/wishlist.resolver';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDividerModule} from '@angular/material/divider';

import {MatSelectModule} from '@angular/material/select';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {FrontPageComponent} from './front-page/front-page.component';
import {ProductListCategoryComponent} from './product-list-category/product-list-category.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: FrontPageComponent,
  },
  {
    path: 'all',
    component: ProductListComponent,
    resolve: [ProductsResolverService],
  },
  {
    path: 'create',
    component: ProductFormComponent,
    canActivate: [AuthGuard, IsWebmasterGuard],
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    resolve: [WishlistResolver],
    canActivate: [AuthGuard],
  },
  {
    path: ':category',
    component: ProductListCategoryComponent,
    resolve: {category: ProductsResolverService},
  },
  {
    path: 'details/:id',
    component: ProductDetailComponent,
    resolve: {res: ProductDetailsResolver},
  },
  {
    path: 'edit/:id',
    component: ProductFormComponent,
    resolve: [ProductsResolverService],
    canActivate: [AuthGuard, IsWebmasterGuard],
  },
];

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductFormComponent,
    WishlistComponent,
    FrontPageComponent,
    ProductListCategoryComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(appRoutes),
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatDividerModule,
    MatTooltipModule,
    MatCardModule,
  ],
})
export class ProductsModule {}
