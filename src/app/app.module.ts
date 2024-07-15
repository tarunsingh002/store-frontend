import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

import {AppComponent} from './app.component';

import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {SharedModule} from './modules/shared/shared.module';
import {AuthInterceptor} from './services/auth-services/auth.interceptor';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import {HeaderComponent} from './header/header.component';

const routes: Routes = [
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/products/products.module').then((m) => m.ProductsModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'buying',
    loadChildren: () => import('./modules/buying/buying.module').then((m) => m.BuyingModule),
  },
  {
    path: 'miscellaneous',
    loadChildren: () =>
      import('./modules/miscellaneous/miscellaneous.module').then((m) => m.MiscellaneousModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then((m) => m.UserModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./modules/page-not-found/page-not-found.module').then((m) => m.PageNotFoundModule),
  },
];

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatTooltipModule,
    MatToolbarModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
