import {DecimalPipe} from '@angular/common';
import {Component, QueryList, ViewChildren, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';
import {Dealer} from './dealer';
import {DealerService} from './dealer.service';
import {NgbdSortableHeader, SortEvent} from './sortable.directive';

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.scss'],
  providers: [DealerService, DecimalPipe]
})
export class DealersComponent implements OnInit {

  dealers$: Observable<Dealer[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: DealerService,private primaryHeader: PrimaryHeaderService) {
    this.dealers$ = service.dealers$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("Customer Interaction System");
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
