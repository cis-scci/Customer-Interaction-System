import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Params,Router } from '@angular/router';
import { HandelError , Dealer } from '../../../shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from '../../../services/rest/global-rest.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ToastrService } from 'ngx-toastr';
import * as uuid from 'uuid';

@Component({
  selector: 'app-dealer-detail',
  templateUrl: './dealer-detail.component.html',
  styleUrls: ['./dealer-detail.component.scss']
})
export class DealerDetailComponent implements OnInit {

  loader: boolean = false;
  dealerDetail : any = {};
  orderDetail : any = [];
  showDetailId : number = 1;
  number : string;
  message : string;
  showSms : boolean = false;

  displayedColumns: string[] = ['OrderID', 'OrderValue','NetPayable','GeneratedOn','SuppliedOn','OrderPaymentTypeName'];
  dataSource:any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private toastr: ToastrService,private restService: GlobalRestService,private primaryHeader: PrimaryHeaderService,private route: ActivatedRoute,private router: Router) {}

  ngOnInit() {
        //setting page title
        this.primaryHeader.pageTitle.next("Dealer Detail");
        this.route.params.subscribe((params: Params) => {
          this.getDealerDetail(params['id']);
    
        }, error => {
          console.error('Error: ', error);
        });        
  }

  getDealerDetail(dealerId){
    this.loader = true;
    // call api code here...
    
    let keyData = [
      {
        "name": "dealerId",
        "value": dealerId
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Dealer.getDealerDetail;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;          
    this.restService.callApi(keyData)
      .subscribe(
      (sucessResponse => {   
        this.loader = false;
        if(sucessResponse.rs == 0){
          this.dealerDetail =  sucessResponse.data.DealerDetail[0];
          this.number = this.dealerDetail.PhoneNo;
        }
        else{          
          this.toastr.error("No Data Found!!");
          this.router.navigate(["dealers"]);
        }
      }),
      (err => {
        //this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
        this.loader = false;
      })
      );
  }

  showDetails(id){
     this.showDetailId = id;
     if(id == 2){
       this.getOrderDetails(0);
     }
  }

  getOrderDetails(status){    
    //this.loader = true;
    // call api code here...
    
    let keyData = [
      {
        "name": "dealerId",
        "value": this.dealerDetail.DealerID
      },
      {
        "name": "orderStatus",
        "value": status.index == 0 ? 'open' : status.index == 1 ? 'dispatch' : status.index == 2 ? 'cancel' : 'open'
      }
    ];

    this.restService.ApiEndPointUrlOrKey = Dealer.getOrderDetail;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;          
    this.restService.callApi(keyData)
      .subscribe(
      (sucessResponse => {     
        this.orderDetail =  sucessResponse.data.OrderDetails;
        this.dataSource = new MatTableDataSource(this.orderDetail);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.loader = false;
      }),
      (err => {
        //this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
        this.loader = false;
      })
      );
  }

  fabButtons = [
    {
      icon: 'phone'
    },
    {
      icon: 'message'
    }
  ];
  
  buttons = [];
  fabTogglerState = 'inactive';  

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {

    if(this.buttons.length){
      this.hideItems();
      this.showSms = false;
    }
    else{
      this.showItems();
    }
    
  }

  fabButtonClicked(btn){
    console.log(btn)
    if(btn == "message"){
      this.showSms = true;
    }
    else if(btn == "phone"){
      this.showSms = false;
      this.callInitiate(this.dealerDetail.PhoneNo);
    }
  }

  sendSMS(){

    //this.loader = true;
    // call api code here...

    fetch("http://msg.wemonde.com/api/sendSMS?token=9beb04432690e175319db4fbc75e406f&senderid=GCCLUB&route=1&unicode=1&number=" +  this.number + "&message=" + this.message)
     .then(res => console.log(res));
    this.toastr.success("SMS sent to the dealer successfully!!");
    this.message = "";
    // let keyData = [
    //   {
    //     "name": "number",
    //     "value": "9667620121"
    //   },
    //   {
    //     "name": "message",
    //     "value": "Hello Testing"
    //   }
    // ];

    // this.restService.ApiEndPointUrlOrKey = Dealer.sendSMS;
    // this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;          
    // this.restService.callApi(keyData)
    //   .subscribe(
    //   (sucessResponse => {     

    //     this.loader = false;
    //   }),
    //   (err => {
    //     //this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
    //     this.loader = false;
    //   })
    //   );

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
          this.toastr.success("Call initiated successfully!!");
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

  backToList(){
    this.router.navigate(["/dealers"]);
  }

}
