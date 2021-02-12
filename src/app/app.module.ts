import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {environment} from '~env/environment';

import {ActionReducerMap, StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {routerReducer, RouterState, StoreRouterConnectingModule} from '@ngrx/router-store';

import {IAppState} from '~store/app.state';
import {AuthEffects} from '~store/auth/auth.effects';
import {ProductsEffects} from '~store/products/products.effects';
import * as fromAuth from '~store/auth/auth.reducer';
import * as fromProducts from '~store/products/products.reducer';

import {AppComponent} from '~app/app.component';
import {AppRoutingModule} from '~app/app-routing.module';
import {AuthGuard} from '@yaari/guards/auth.guard';
import {TokenInterceptor} from '@yaari/interceptors/token.interceptor';
import {MatSnackBarModule} from '@angular/material/snack-bar';

const reducers: ActionReducerMap<IAppState> = {
  ['router']: routerReducer,
  [fromAuth.authFeatureKey]: fromAuth.reducer,
  [fromProducts.productFeatureKey]: fromProducts.reducer
};

const effects = [
  AuthEffects,
  ProductsEffects
];

export function getReducers(): ActionReducerMap<IAppState> {
  return reducers;
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSnackBarModule,
    StoreModule.forRoot(
      {...getReducers()},
      {
        metaReducers: [fromAuth.clearState],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true
        }
      }
    ),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal
    }),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production})
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
