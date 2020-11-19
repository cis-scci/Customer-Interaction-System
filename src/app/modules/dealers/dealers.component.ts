import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';
import { Router } from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { HandelError , Dealer } from '../../shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from '../../services/rest/global-rest.service';
import * as uuid from 'uuid';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.scss']
})
export class DealersComponent implements OnInit {

  loader: boolean = false;

  displayedColumns: string[] = ['DealershipName', 'DistributorName','DistrictName','StateName','phone','Action','Call'];
  dataSource:any;
  callInitiated : boolean = false;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private toastr: ToastrService,private restService: GlobalRestService,private primaryHeader: PrimaryHeaderService,private router: Router) {}

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("Dealers List");
    this.getDealerList();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getDealerList(){
    this.loader = true;
    // call api code here...
    
    let keyData = [
      {
        "name": "MarketingRepID",
        "value": localStorage.getItem("currentUser")
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Dealer.getDealerList;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;          
    this.restService.callApi(keyData)
      .subscribe(
      (sucessResponse => {     
        //console.log(sucessResponse)          
        this.loader = false;
        this.dataSource = new MatTableDataSource(sucessResponse.data.DealerList);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }),
      (err => {
        //this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
        this.loader = false;
      })
      );
  }

  addCard(dealershipName,id,phone,deviceId){
       //setting Dealer Name
       this.primaryHeader.dealerName.next(dealershipName);
       let navigateUrl = "/dealers/" + id + "/" + phone + "/" + deviceId + "/approval";
       
       this.router.navigate([navigateUrl]);
  }

  navigateToDetail(id){
    this.router.navigate(["/dealers/" + id  + "/detail"]);
  }

  callInitiate(phoneNo){    
    this.loader = true;
    // call api code here...
    
    let reqParams = {
      "user_id":"5f804e3f0815e380",
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
