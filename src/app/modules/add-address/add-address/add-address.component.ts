import { Component, OnInit } from '@angular/core';
import { PrimaryHeaderService } from '../../layout/primary-header/primary-header.service';
import { HandelError , Dealer } from '../../../shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from '../../../services/rest/global-rest.service';
import { ActivatedRoute,Router,Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {

  dealerId : string = "";  
  pincode : string = "";
  pincodeDetails : any = {};
  loader: boolean = false;
  addAddressFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder,private restService: GlobalRestService,private toastr: ToastrService,private router:Router, private route: ActivatedRoute, private primaryHeader: PrimaryHeaderService,private http: HttpClient) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("Add Address");
    this.addAddressFormGroup = this._formBuilder.group({
      shopName:      ['', Validators.required],
      area:     ['', Validators.required],
      city:     ['', Validators.required],
      state:     ['', Validators.required],
      pincode:      ['', Validators.required],
      landmark:     ['']
    }); 

    this.route.params.subscribe((params: Params) => {
      this.dealerId = params['id'];
      this.pincode =  params['pincode'];
      this.getPincodeDetail();
    }, error => {
      console.error('Error: ', error);
    });    

  }

  addAddress(){
    if(this.addAddressFormGroup.controls["shopName"].valid === false){
      this.toastr.warning("Please type shop name!!");
      return;
    }
    if(this.addAddressFormGroup.controls["area"].valid === false){
      this.toastr.warning("Please type area!!");
      return;
    }
    if(this.addAddressFormGroup.controls["city"].valid === false){
      this.toastr.warning("Please type city name!!");
      return;
    }

    else if(this.addAddressFormGroup.valid){
      
        this.loader = true;
        
        let params = 
          {
            "Address": this.addAddressFormGroup.controls["shopName"].value,
            "Address1": this.addAddressFormGroup.controls["area"].value,
            "Address2": this.addAddressFormGroup.controls["landmark"].value,
            "DealerID": this.dealerId,
            "DistrictName": this.addAddressFormGroup.controls["city"].value,
            "PinCode": this.addAddressFormGroup.controls["pincode"].value,
            "StateName": this.addAddressFormGroup.controls["state"].value
          }

        //console.log(params);
        // call api code here... 
        this.restService.ApiEndPointUrlOrKey = Dealer.updateDealerAddress;
        this.restService.HttpPostParams = params;
        this.restService.AlertAndErrorAction = HandelError.HideAndKill;
        this.restService.callApi()
          .subscribe(
          (sucessResponse => { 
            //console.log(sucessResponse);
            this.loader = false;                                     
            if(sucessResponse.rs == 0){
              this.toastr.success("Address Updated Successfully!!");
              this.router.navigate(["/dealers"]);
            }
            else if(sucessResponse.rs == 1){
              this.toastr.warning(sucessResponse.msg);
            }         
            else
              this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
          }),
          (err => {
            this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
            this.loader = false;
          })
          );
    }

  }

  getPincodeDetail(){
    this.loader = true;        

    let keyData = [
      {
        "name": "pincode",
        "value": this.pincode
      }
    ];

    // call api code here... 
    this.restService.ApiEndPointUrlOrKey = Dealer.getPinCodeDetail;    
    this.restService.AlertAndErrorAction = HandelError.HideAndKill;
    this.restService.callApi(keyData)
      .subscribe(
      (sucessResponse => { 
        //console.log(sucessResponse);
        this.loader = false;                                     
        if(sucessResponse.rs == 0){
           this.pincodeDetails = sucessResponse.data[0];           
           this.addAddressFormGroup.controls["area"].setValue(this.pincodeDetails.Area),
           this.addAddressFormGroup.controls["city"].setValue(this.pincodeDetails.districtname),
           this.addAddressFormGroup.controls["pincode"].setValue(this.pincode),
           this.addAddressFormGroup.controls["state"].setValue(this.pincodeDetails.statename)
        }                
        else
          this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
      }),
      (err => {
        this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
        this.loader = false;
      })
      );
  }

  uploadVisitingCard(event){    
    
      let file = event.target.files[0];

      if (this.validateFile(file.name)) {       
           let formdata: FormData = new FormData();
           formdata.append('documentfile', file);
 
             this.loader = true;
 
             const req = new HttpRequest('POST', "http://dev.scci.co.in:88/V1/CISOrderingAPI/api/Auth/UpdateDealersCard?DealerID=" + this.dealerId, formdata, {
               reportProgress: true,
               responseType: 'text'
             });
             this.http.request(req).subscribe(event => {          
               let eventObj : any = event;
               if (eventObj.partialText) {
                 let statusCode = JSON.parse(eventObj.partialText).rs;
                 if (statusCode == "0") {
                     this.loader = false;
                     //this.toastr.success("Photo Updated Successfully!!");
                 }
                 else{
                  this.loader = false;
                   this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
                 }
               }
             });       
    }
    
    else {
     this.toastr.error("", "Please choose file in ['jpeg', 'jpg', 'png'] format.");
   }

  }

  validateFile(name: String) {
    let extCont: any[] = ['jpeg', 'jpg', 'png']
    let Fileext: string = (name.substring(name.lastIndexOf('.') + 1)).toLowerCase();
    if (extCont.includes(Fileext)) {
      return true;
    }
    else {
      return false;
    }
  }

}
