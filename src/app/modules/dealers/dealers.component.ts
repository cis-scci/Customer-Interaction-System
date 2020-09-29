import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';
import { Router } from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { HandelError , Dealer } from '../../shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from '../../services/rest/global-rest.service';

@Component({
  selector: 'app-dealers',
  templateUrl: './dealers.component.html',
  styleUrls: ['./dealers.component.scss']
})
export class DealersComponent implements OnInit {

  loader: boolean = false;

  displayedColumns: string[] = ['DealershipName', 'DistributorName','DistrictName','StateName','phone','Action'];
  dataSource:any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private restService: GlobalRestService,private primaryHeader: PrimaryHeaderService,private router: Router) {}

  ngOnInit() {
    //setting page title
    this.primaryHeader.pageTitle.next("Dealers Detail");
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
        "name": "staffId",
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

  addCard(dealershipName,id,phone){
       //setting Dealer Name
       this.primaryHeader.dealerName.next(dealershipName);
       let navigateUrl = "/dealers/" + id + "/" + phone + "/approval";
       this.router.navigate([navigateUrl]);
  }

  navigateToDetail(id){
    this.router.navigate(["/dealers/" + id  + "/detail"]);
  }

}
