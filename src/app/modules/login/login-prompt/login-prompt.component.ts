import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RestApiParams, HandelError, RestMethods } from '../../../shared/models/app.models';
import { GlobalRestService } from '../../../services/rest/global-rest.service'
import { AppsettingsConfService } from '../../../services/conf/appsettings-conf/appsettings-conf.service'

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

  constructor(private restService: GlobalRestService, private configService : AppsettingsConfService, private router : Router) { 
    
    this.restPrams = new RestApiParams;
    this.restPrams.ShowLoadingSpinner = true;
    this.restPrams.AlertAndErrorAction =  HandelError.ShowAndReturn;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");
    
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

    this.errMessage = "";
    const username : string = this.loginFormGroup.controls.username.value;
    const password : string = this.loginFormGroup.controls.password.value;

    // let httpPostParams = { 
    //   Username : username, 
    //   Password : password 
    // }

    // //call the token endpoint
    // this.restService.ApiEndPointUrlOrKey = this.appSettingsJson.token.url;
    // this.restService.ApiEndPointMehod = this.appSettingsJson.token.method; 
    // this.restService.HttpPostParams = httpPostParams;
    // this.restService.AlertAndErrorAction = HandelError.HideAndReturn;
    // this.restService.callApi()
    //   .subscribe(sucessResponse => {
    //       if(sucessResponse.token.access_token != "")
    //       {
    //         localStorage.setItem('accessToken', sucessResponse.token.access_token);
    //         this.router.navigate(['/main']);
    //       }
    //       else
    //       {
    //         localStorage.removeItem("accessToken");
    //         localStorage.removeItem("currentUser");
    //         this.errMessage = 'Un-expected error';
    //       }
    //   }, errorResponse => {
    //       //view returned error object
    //       localStorage.removeItem("accessToken");
    //       localStorage.removeItem("currentUser");
    //       this.errMessage = 'Username or password is incorrect';
    //     }
    //   );
    if (this.loginFormGroup.valid === false || !(username =="sales@test.com" && password == "test-admin")) {      
      let form = document.getElementById('loginForm');
      form.classList.add('was-validated');
      if(username != "" && password != "")
      this.errMessage = 'Username or password is incorrect';
    } else if (this.loginFormGroup.valid === true) {  
      if(username =="sales@test.com" && password == "test-admin")    
      this.router.navigate(['/main']);
    }
  }
}
