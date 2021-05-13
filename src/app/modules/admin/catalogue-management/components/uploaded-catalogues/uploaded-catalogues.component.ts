import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { IUploadedCatalogue } from '@yaari/models/admin/admin.interface';
import { AdminService } from '@yaari/services/admin/admin.service';
import * as fileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as fromAdminActions from '~app/store/admin/admin.actions';
import * as fromAdminSelectors from '~app/store/admin/admin.selectors';
import { AppFacade, IAppState } from '~app/store/app.state';

@Component({
  selector: 'app-uploaded-catalogues',
  templateUrl: './uploaded-catalogues.component.html',
  styleUrls: ['./uploaded-catalogues.component.scss']
})
export class UploadedCataloguesComponent implements OnInit, OnDestroy {

  constructor(
    private _store: Store<IAppState>,
    private _adminService: AdminService,
    private _appFacade: AppFacade
  ) { }


  displayedColumns = [
    'catalogue_name',
    'product_count',
    'supplier_business_name',
    'action',
  ];
  dataSource: MatTableDataSource<any[]>;
  allData = [];
  filter = '';
  private _subscription: Subscription = new Subscription();

  public getIsError$ = this._store.pipe(
    select(fromAdminSelectors.getIsError));

  public uploadedCatalogues$ = this._store.pipe(
    select(fromAdminSelectors.getUploadedCatalogues),
    filter(details => !!details)
  );
  ngOnInit(): void {
    this._appFacade.clearMessages();
    this._adminService.authorizedAdmin('catalogue_management');
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getUploadedCatalogues(): void {
    this._store.dispatch(fromAdminActions.getUploadedCatalogues());
    this._subscription.add(this.uploadedCatalogues$.subscribe(res => {
      this.allData = res;
      this.dataSource = new MatTableDataSource(this.allData);
    }));
  }

  downloadCatalogueExcel(catalogue: IUploadedCatalogue): void {
    this._subscription.add(this._adminService.getCatalogueDownload(+catalogue.catalogue_id).subscribe(res => {
      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fileSaver.saveAs(blob, `${catalogue.catalogue_name}.xlsx`);
    }));
  }
}
