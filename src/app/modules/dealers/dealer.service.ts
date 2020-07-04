import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {Dealer} from './dealer';
import {Dealers} from './dealers';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from './sortable.directive';

interface SearchResult {
  dealers: Dealer[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(dealers: Dealer[], column: SortColumn, direction: string): Dealer[] {
  if (direction === '' || column === '') {
    return dealers;
  } else {
    return [...dealers].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(dealer: Dealer, term: string, pipe: PipeTransform) {
  return dealer.dealership_name.toLowerCase().includes(term.toLowerCase())
    || dealer.contact.toString().includes(term.toLowerCase())
}

@Injectable({providedIn: 'root'})
export class DealerService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _dealers$ = new BehaviorSubject<Dealer[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 5,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._dealers$.next(result.dealers);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get dealers$() { return this._dealers$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let dealers = sort(Dealers, sortColumn, sortDirection);

    // 2. filter
    dealers = dealers.filter(dealer => matches(dealer, searchTerm, this.pipe));
    const total = dealers.length;

    // 3. paginate
    dealers = dealers.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({dealers, total});
  }
}