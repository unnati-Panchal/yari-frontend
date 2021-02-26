import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import * as moment from 'moment';
import {ESalesStatus, IExchangeReturned, IQuery} from '@yaari/models/product/product.interface';
import {select, Store} from '@ngrx/store';
import * as fromProfileSelectors from '~store/profile/profile.selectors';
import {filter} from 'rxjs/operators';
import {IAppState} from '~store/app.state';
import * as fromProfileActions from '~store/profile/profile.actions';


@Component({
  selector: 'app-exchange-return',
  templateUrl: './exchange-return.component.html',
  styleUrls: ['./exchange-return.component.scss']
})
export class ExchangeReturnComponent implements OnInit, OnDestroy {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  displayedColumns: string[] = [
    'serial_num', 'order_id', 'product_sku_id', 'shipped_date', 'exchange_or_return_date', 'product_type', 'penalty', 'penalty_amount'];
  dataSource: IExchangeReturned[];
  public exchangedReturned$ = this._store.pipe(select(fromProfileSelectors.exchangedReturned$), filter(ex => !!ex));
  public isError$ = this._store.pipe(select(fromProfileSelectors.getIsError$), filter(err => !!err));
  loading: boolean;
  submitted: boolean;
  selectedDate: IQuery;
  eSalesStatus = ESalesStatus;
  selectDate: string;

  private _subscription: Subscription = new Subscription();

  constructor(private _store: Store<IAppState>) { }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getResults();
  }

  public viewBtn(status: ESalesStatus): void {
    const query = {
      startDate: this.selectedDate.startDate,
      endDate: this.selectedDate.endDate,
      status
    };
    this.selectDate = null;
    if (!query || !query?.startDate || !query?.endDate) {
      this.selectDate = 'Please Select Date Range!';
      return;
    }
    this.loading = true;
    this.submitted = true;
    this._store.dispatch(fromProfileActions.getExchangedReturned({query}));
  }

  getResults(): void {
    this._subscription.add(
      this.range.valueChanges.subscribe( range => {
        const start = moment(range.start)?.format('YYYY-MM-DD');
        const end = moment(range.end)?.format('YYYY-MM-DD');
        if (start && end && start !== 'Invalid date' && end !== 'Invalid date') {
          this.selectedDate = {startDate: start, endDate: end};
        }
      })
    );

    this._subscription.add(
      this.exchangedReturned$.subscribe((response) => {
        this.loading = false;
        this.dataSource = response;
      })
    );
    this._subscription.add(
      this.isError$.subscribe(() => {
        this.loading = false;
        this.dataSource = [];
      })
    );
  }
}
