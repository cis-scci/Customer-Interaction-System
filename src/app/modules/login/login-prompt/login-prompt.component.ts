import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RestApiParams, HandelError, RestMethods } from '../../../shared/models/app.models';
import { Login } from '../../../shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from '../../../services/rest/global-rest.service'
import { AppsettingsConfService } from '../../../services/conf/appsettings-conf/appsettings-conf.service'
import { ToastrService } from 'ngx-toastr';
import appSettings from "../../../../assets/config/settings.json"

@Component({
  selector: 'app-login-prompt',
  templateUrl: './login-prompt.component.html',
  styleUrls: ['./login-prompt.component.scss']
})
export class LoginPromptComponent implements OnInit {
  public loginFormGroup: FormGroup;
  public errMessage = "";
  private restPrams : RestApiParams;
  private appSettingsJson : any = {};
  public loginInvalid: boolean;

  loader: boolean = false;

  constructor(private toastr: ToastrService,private restService: GlobalRestService, private configService : AppsettingsConfService, private router : Router) { 
    
    this.restPrams = new RestApiParams;
    this.restPrams.ShowLoadingSpinner = true;
    this.restPrams.AlertAndErrorAction =  HandelError.ShowAndReturn;

    
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_type");
  }

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }
  
  public login(event){
    event.preventDefault();
    event.stopPropagation();
    
    this.appSettingsJson = appSettings;

    if(!this.loginFormGroup.valid){
       return this.toastr.error("Please type correct email id and password!!")
     }

    this.errMessage = "";
    const username : string = this.loginFormGroup.controls.username.value;
    const password : string = this.loginFormGroup.controls.password.value;
    this.loginInvalid = false;

    this.loader = true;

    let keyData = [
      {
        "name": "email",
        "value": username
      },
      {
        "name": "password",
        "value": password
      }
    ];

    // //call the token endpoint
    this.restService.ApiEndPointUrlOrKey = Login.userLogin;       
    this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    this.restService.callApi(keyData)
      .subscribe(sucessResponse => {
        this.loader = false;
          if(sucessResponse.rs == 0)
          {
            localStorage.setItem('currentUser', Number(sucessResponse.data.LoginData[0].StaffID).toString());
            localStorage.setItem('user_name', sucessResponse.data.LoginData[0].StaffName);
            localStorage.setItem('user_type', sucessResponse.data.LoginData[0].BaseLocation);
            this.router.navigate(['/main']);
          }
          else
          {
            this.toastr.error("Please type correct email id and password!!")
            let form = document.getElementById('loginForm');
            form.classList.add('was-validated');
            if(username != "" && password != "")
             this.errMessage = 'Username or password is incorrect';

            localStorage.removeItem("currentUser");
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_type');
          }
      }, errorResponse => {
        this.loader = false;
          //view returned error object          
          this.errMessage = 'Username or password is incorrect';
          localStorage.removeItem("currentUser");
          localStorage.removeItem('user_name');
          localStorage.removeItem('user_type');
        }
      );
    
    
  }
}
