import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';
import { Router } from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { HandelError , Dashboard } from '../../shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from '../../services/rest/global-rest.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  loader: boolean = false;
  orderSummary : any = {};
  onBoarding : any = [];
  payments : any = {};
  order : any = [];
  

  displayedColumns: string[] = ['Sno','OrderID', 'DealershipName','listOrderItem','OrderPaymentTypeName','PhoneNo','OrderValue'];
  dataSource:any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor( private toastr: ToastrService,private restService: GlobalRestService,private primaryHeader: PrimaryHeaderService) { }

  ngOnInit() {
    //setting page title
    
    this.primaryHeader.pageTitle.next("Dashboard");
    this.getDashboardDetails();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  public showMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    document.querySelector('body').classList.add('az-iconbar-show');
  }

  public getDashboardDetails(){
    this.loader = true;
    // call api code here...
    
    let reqParams = {
      "StaffID": localStorage.getItem("currentUser"),
      "Fromdate":"2019-08-01",
      "Todate":"2020-09-29"
     }

    this.restService.ApiEndPointUrlOrKey = Dashboard.getDashboardDetails;
    this.restService.HttpPostParams = reqParams;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;          
    this.restService.callApi()
      .subscribe(
      (sucessResponse => {     
        this.loader = false;
        //console.log(sucessResponse)
        if(sucessResponse.rs == 0){
           this.orderSummary = sucessResponse.data.orderSummary;
           this.onBoarding = sucessResponse.data.onBoarding;
           this.payments = sucessResponse.data.payments;
           this.order = sucessResponse.data.order;
           this.dataSource = new MatTableDataSource(sucessResponse.data.order);
           this.dataSource.sort = this.sort;
           this.dataSource.paginator = this.paginator;
        }
        else if(sucessResponse.rs == 1){
          this.toastr.error("Some problem occured. Kindly try again later!!");
        }
      }),
      (err => {
        this.toastr.error("Some problem occured. Kindly try again later!!");
        this.loader = false;
      })
      );    
  }

  
}