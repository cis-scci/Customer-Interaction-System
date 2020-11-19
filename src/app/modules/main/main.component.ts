import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';
import { Router } from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { HandelError , Dashboard, Dealer } from '../../shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from '../../services/rest/global-rest.service';
import { ToastrService } from 'ngx-toastr';
import * as uuid from 'uuid';

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
  callInitiated : boolean = false;

  displayedColumns: string[] = ['Sno','OrderID', 'DealershipName','PhoneNo','listOrderItem','OrderPaymentTypeName','Discounts','OrderValue'];
  dataSource:any;
  orderDataList:any = [];

  displayedOnboardingColumns: string[] = ['Sno','DealershipName','DealerAddress','DateOfEnrolment','PhoneNo','DistributorName'];
  dataSourceOnboarding:any;
  onboardingDataList:any = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor( private toastr: ToastrService,private restService: GlobalRestService,private primaryHeader: PrimaryHeaderService) { }

  ngOnInit() {
    //setting page title
    
    this.primaryHeader.pageTitle.next("Dashboard");
    this.getDashboardOrderDetails();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  applyOnboardingFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSourceOnboarding.filter = filterValue;
  }

  public showMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    document.querySelector('body').classList.add('az-iconbar-show');
  }

  public getDashboardOrderDetails(){
    if(this.orderDataList.length > 0)
     return;
    this.loader = true;
    this.orderDataList = [];
    this.onboardingDataList = [];
    // call api code here...
    
    let reqParams = {
      "MarketingRepID": localStorage.getItem("currentUser"),
      "Fromdate":"2019-08-01",
      "Todate":"2020-09-29"
     }

    this.restService.ApiEndPointUrlOrKey = Dashboard.getDashboardOrderDetails;
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
           this.orderDataList = sucessResponse.data.order;
           this.onboardingDataList = [];
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

  public getDashboardOnboardingDetails(){
    if(this.onboardingDataList.length > 0)
     return;
    this.orderDataList = [];
    this.onboardingDataList = [];
    this.loader = true;
    // call api code here...
    
    let reqParams = {
      "MarketingRepID": localStorage.getItem("currentUser"),
      "Fromdate":"2019-08-01",
      "Todate":"2020-09-29"
     }

    this.restService.ApiEndPointUrlOrKey = Dashboard.getDashboardOnboardingDetails;
    this.restService.HttpPostParams = reqParams;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;          
    this.restService.callApi()
      .subscribe(
      (sucessResponse => {     
        this.loader = false;
        //console.log(sucessResponse)
        if(sucessResponse.rs == 0){                      
           this.dataSourceOnboarding = new MatTableDataSource(sucessResponse.data.DealerOnboardinglist);
           this.dataSourceOnboarding.sort = this.sort;
           this.dataSourceOnboarding.paginator = this.paginator;
           this.orderDataList = [];
           this.onboardingDataList = sucessResponse.data.DealerOnboardinglist;
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

  callInitiate(phoneNo){    
    this.loader = true;
    // call api code here...
    
    let reqParams = {
      "user_id": "", //"5f804e3f0815e380",
      "number":"+91" + phoneNo,
      "reference_id": uuid.v4()
     }

    this.restService.ApiEndPointUrlOrKey = Dealer.initiateCall;
    this.restService.HttpPostParams = reqParams;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;          
    this.restService.callApi()
      .subscribe(
      (sucessResponse => {     
        this.loader = false;
        //console.log(sucessResponse)
        if(sucessResponse.rs == 0){
          //this.toastr.success("Call initiated successfully!!");
          this.callInitiated = true;
        }
        else if(sucessResponse.rs == 1){
          this.toastr.error("Some problem occured in initiating the call. Kindly try again later!!");
        }
      }),
      (err => {
        this.toastr.error("Some problem occured in initiating the call. Kindly try again later!!");
        this.loader = false;
      })
      );    
  }

  closeModel(){
    this.callInitiated = false;
  }

  
}