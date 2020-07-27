import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Dealers} from './dealers';

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.scss']
})
export class DealersComponent implements OnInit {

  displayedColumns: string[] = ['id', 'dealership_name', 'distributor_name','city_district','state','contact'];
  dataSource = new MatTableDataSource(Dealers);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private primaryHeader: PrimaryHeaderService) {}

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("Customer Interaction System");
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
