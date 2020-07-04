import { Component, OnInit } from '@angular/core';
import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor( private primaryHeader: PrimaryHeaderService) { }

  ngOnInit() {
    //setting page title
    
    this.primaryHeader.pageTitle.next("Dashboard");
  }
  public showMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    document.querySelector('body').classList.add('az-iconbar-show');
  }
}
