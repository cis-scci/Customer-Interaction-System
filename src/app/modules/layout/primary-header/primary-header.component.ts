import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PrimaryHeaderService } from './primary-header.service';
import { Subscription, config } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-primary-header',
  templateUrl: './primary-header.component.html',
  styleUrls: ['./primary-header.component.scss']
})
export class PrimaryHeaderComponent implements OnInit, OnDestroy {
  public page_title: string = "";
  public config : any;
  public subscriptions: Subscription[] = [];
  //Setting up page title
  // @Input() get pageTitle() {
  //   return this.pageTitle;
  // }
  // set pageTitle(pageTitleValue: string) {
  //   this.page_title = pageTitleValue;
  // }
  constructor(private primaryHeaderService: PrimaryHeaderService,
              private router: Router
              ) { }
  ngOnInit() {
    //Setting up page title
    this.setPageTitle();
    // this.setBackButtonConfig();
    // this.config = {
    //   "show_button": false,
    //   "navigate_url": "",
    //   "page_title" : ""
    // }
  }
  public setPageTitle() {
    this.subscriptions.push(this.primaryHeaderService.pageTitle.subscribe(value => this.page_title = value));
  }
  public setBackButtonConfig(){
    this.subscriptions.push(this.primaryHeaderService.header_config.subscribe(value => this.config = value));
   
  }
  ngOnDestroy() {
    //Unsubscribing all subscriptions to avoid memory leak    
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
  public navigate(){
    if(this.config.navigate_url != "")
    this.router.navigate([this.config.navigate_url]);
    this.config = {
      "show_button": false,
      "navigate_url": "",
      "page_title" : ""
    }
  }
}