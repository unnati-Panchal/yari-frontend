import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductComponent} from '~platform/product/components/product/product.component';
import {CatalogueComponent} from '~platform/product/components/catalogue/catalogue.component';
import {CatalogueStatusComponent} from '~platform/product/components/catalogue-status/catalogue-status.component';
import {SpecificationComponent} from '~platform/product/components/specification/specification.component';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {
        path: 'catalogue',
        component: CatalogueComponent
      },
      {
        path: 'catalogue-status',
        component: CatalogueStatusComponent
      },
      {
        path: 'specification',
        component: SpecificationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {
}