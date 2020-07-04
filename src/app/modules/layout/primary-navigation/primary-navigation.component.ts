import { Component, OnInit, ElementRef, ViewChild, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
//import { map, tap, catchError, finalize, flatMap, mergeMap } from 'rxjs/operators';
import { SvgIconRegistryService } from 'angular-svg-icon';

//import { HandelError, RestMethods } from '../../../shared/models/app.models';
import { GlobalRestService } from '../../../services/rest/global-rest.service'
import { AppsettingsConfService } from '../../../services/conf/appsettings-conf/appsettings-conf.service';
import { Compiler } from '@angular/core';

import appSettings from "../../../../assets/config/settings.json"

@Component({
  selector: 'app-primary-navigation',
  templateUrl: './primary-navigation.component.html',
  styleUrls: ['./primary-navigation.component.scss']
})
export class PrimaryNavigationComponent implements OnInit, AfterContentChecked {
  private appSettingsJson: any = {};
  //private restPrams: RestApiParams;

  //Application Menu Json
  public boolDataLoaded: boolean = false;
  public navData: any;
  public navModules: any;
  public navDesc: any;
  public moduleCount = 0;
  public navOpenStyle: boolean = false;
  //`static` - This is new in Angular 8 and indicates whether or not to resolve query results before change detection runs.
  @ViewChild('aside', { static: true }) aside: ElementRef;

  constructor(private restService: GlobalRestService, private configService: AppsettingsConfService,
    private router: Router, private registry: SvgIconRegistryService, private _compiler: Compiler) {
    // this.restPrams = new RestApiParams;
    // this.restPrams.ShowLoadingSpinner = true;
    // this.restPrams.AlertAndErrorAction = HandelError.ShowAndReturn;

  }

  ngOnInit() {
  
    this.appSettingsJson = appSettings;

    //save app settings in config service for later use
    this.configService.setAppSettings(this.appSettingsJson);

    //pass application identification
    let httpPostParams = {
      app_id: this.appSettingsJson.application_guid,
      app_type: this.appSettingsJson.application_type,
    }
    // this.restPrams.ApiEndPointUrlOrKey = this.appSettingsJson.appmodulesandroutes.url;
    // this.restPrams.ApiEndPointMehod = this.appSettingsJson.appmodulesandroutes.method;
    // this.restPrams.HttpPostParams = httpPostParams;

    this.restService.ApiEndPointUrlOrKey = this.appSettingsJson.appmodulesandroutes.url;
    this.restService.ApiEndPointMehod = this.appSettingsJson.appmodulesandroutes.method;
    this.restService.HttpPostParams = httpPostParams;

    this.restService.callApi()
      .subscribe(sucessResponse => {
        this.navModules = sucessResponse.app_modules;

        this.navDesc = sucessResponse.app_desc;
        //save app routes in config service for later use
        this.configService.setAppRoutes(sucessResponse.app_routes);
        this.boolDataLoaded = true;
      }, errorResponse => {
        //view returned error object
      }
      );
  }

  // ----- commented by Gunjan Sharma on 03-dec-2019
  // Throw ERROR - "Cannot read property 'nativeElement' of undefined"
  //--- This is new in angular 8, called before the directive content is checked (@ViewChild)
  // ngDoCheck() {
  //   // if (this.aside.nativeElement.classList.contains('show')) this.navOpenStyle = true;
  //   // else this.navOpenStyle = false;
  // }

  // called right after the directive content is checked.
  ngAfterContentChecked() {
    //console.log('After Content checked called')
    if (this.aside.nativeElement.classList.contains('show')) this.navOpenStyle = true;
    else this.navOpenStyle = false;
    //console.log(this.navOpenStyle)
  }

  showMenu(event, div_id) {
    // console.log('mouse enter ')
    event.preventDefault();
    event.stopPropagation();

    let elements = document.querySelectorAll('.nav-link');
    for (let element = 0; element < elements.length; element++) {
      elements[element].classList.remove('on-hover');
    }
    event.target.parentElement.classList.add('on-hover');
    event.target.classList.add('on-hover');

    document.querySelector('.az-iconbar-aside').classList.remove('in-transit');
    document.querySelector('.az-iconbar-aside').classList.add('show');
    elements = document.querySelectorAll('.az-iconbar-pane');
    for (let element = 0; element < elements.length; element++) {
      elements[element].classList.remove('show');
    }
    document.getElementById(div_id).classList.add('show');
  }

  clickedFooterMenu(event, div_id) {
    this.clickMobile(event, div_id);
    this.showMenu(event, div_id);
  }

  clickClose(event, clickAndFollowLink) {

    if (clickAndFollowLink == false) {
      event.preventDefault();
      event.stopPropagation();
    }
    let elements = document.querySelectorAll('.nav-link');
    let elemParent = document.getElementById('side-nav');
    for (let element = 0; element < elements.length; element++) {
      elements[element].classList.remove('on-hover');
    }
    elemParent.classList.remove('on-hover');

    document.querySelector('.az-iconbar-aside').classList.remove('show');
    document.querySelector('.az-iconbar-aside').classList.add('in-transit');

    let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width <= 991) {
      document.querySelector('body').classList.remove('az-iconbar-show');
    }
  }

  modClose(event, clickAndFollowLink, div_id) {
    let elements = document.querySelectorAll('.nav-link');
    for (let element = 0; element < elements.length; element++) {
      elements[element].classList.remove('on-active');
    }
    document.getElementById('icon-mod' + div_id).classList.add('on-active');
    this.clickClose(event, clickAndFollowLink);
  }

  clickMobile(event, div_id) {
    event.preventDefault();
    event.stopPropagation();
    document.querySelector('body').classList.add('az-iconbar-show');
  }

  logout() {
    this._compiler.clearCache();
    this.router.navigate(['/login']);
  }

}
