import { Component, OnInit } from '@angular/core';
import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';
import { HandelError , Dealer } from '../../shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from '../../services/rest/global-rest.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  dealerId : string = "";  
  loader: boolean = false;
  signUpFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder,private restService: GlobalRestService,private toastr: ToastrService,private router:Router, private route: ActivatedRoute, private primaryHeader: PrimaryHeaderService) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("Sign Up");
    this.signUpFormGroup = this._formBuilder.group({
      phone:      ['', [Validators.required,Validators.pattern('[6-9]{1}[0-9]{9}')]],
      firstName:     ['', Validators.required],
      lastName:     ['', Validators.required],
      pincode:     ['', [Validators.required, Validators.pattern('^[0-9]{6}')]]
    }); 
  }

  signUp(){
    if(this.signUpFormGroup.controls["phone"].valid === false){      
      this.signUpFormGroup.controls["phone"].errors.pattern ? this.toastr.warning("Please type correct phone number!!") : this.toastr.warning("Please type phone number!!");
      return;
    }
    if(this.signUpFormGroup.controls["firstName"].valid === false){
      this.toastr.warning("Please type first name!!");
      return;
    }
    if(this.signUpFormGroup.controls["lastName"].valid === false){
      this.toastr.warning("Please type last name!!");
      return;
    }
    if(this.signUpFormGroup.controls["pincode"].valid === false){      
      this.signUpFormGroup.controls["pincode"].errors.pattern ? this.toastr.warning("Please type correct pin code!!") : this.toastr.warning("Please type pin code!!");
      return;
    }
    else if(this.signUpFormGroup.valid){      

        this.loader = true;
        
        let params = {
          "DealerID": 0,
          "DealerImageURL": "",
          "DealershipName": "",
          "DeviceID": "Web",
          "DirectDealer": false,
          "MiddleName": " ",
          "Name": this.signUpFormGroup.controls["firstName"].value,
          "PhoneNo": this.signUpFormGroup.controls["phone"].value,
          "PinCode": this.signUpFormGroup.controls["pincode"].value,
          "Surname": this.signUpFormGroup.controls["lastName"].value,
        };

        //console.log(params);
        // call api code here... 
        this.restService.ApiEndPointUrlOrKey = Dealer.registerNewDealer;
        this.restService.HttpPostParams = params;
        this.restService.AlertAndErrorAction = HandelError.HideAndKill;
        this.restService.callApi()
          .subscribe(
          (sucessResponse => { 
            //console.log(sucessResponse);
            this.loader = false;                                     
            if(sucessResponse.rs == 0){
              this.toastr.success("Account has been created successfully.!!");
              let dealerId = sucessResponse.data[0].DealerID;
              let pinCode = this.signUpFormGroup.controls["pincode"].value;
              this.router.navigate(["/dealers/add/address/" + dealerId  + "/" + pinCode]);
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

}
