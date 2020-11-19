import { Component, OnInit } from '@angular/core';
import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';
import { HandelError , LeaderBoard } from '../../shared/enumrations/app-enum.enumerations';
import { GlobalRestService } from '../../services/rest/global-rest.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilterService } from '../../services/filter/filter.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  
  loader: boolean = false;
  leaderboardDetails : any = [];
  backPageFlag : any = "";
  marketingRepId : string = "";
  constructor(private selfieFlagService:FilterService, private restService: GlobalRestService,private toastr: ToastrService,private router:Router, private route: ActivatedRoute, private primaryHeader: PrimaryHeaderService) { }

  ngOnInit() {
    this.primaryHeader.pageTitle.next("Leader Board");
    this.marketingRepId = localStorage.getItem("currentUser");
    this.selfieFlagService.selfieUploaded.next("");
    this.route.params.subscribe(params => {
      this.route.queryParams.subscribe(params => {        
        if(params['backPageFlag']){
          this.backPageFlag = params['backPageFlag'];
        }
        
        this.getLeaderboardDetails();
     });
    }) 
  }

  getLeaderboardDetails(){  
      
    let keyData = [
      {
        "name": "MarketingRepID",
        "value": this.marketingRepId
      }
    ];

    debugger
    this.loader = true;
    this.restService.ApiEndPointUrlOrKey = LeaderBoard.getLeadershipBoardDetails;
    this.restService.AlertAndErrorAction = HandelError.ShowAndReturn;
    this.restService.callApi(keyData)
      .subscribe(        
      (sucessResponse => {                       
        this.loader = false;
        if(sucessResponse.rs == 0){
          this.leaderboardDetails = sucessResponse.data;
          if(this.leaderboardDetails.ListOfMarketing[0].MarketingRepID == this.marketingRepId && this.backPageFlag == ""){
            this.selfieFlagService.selfieUploaded.next(this.leaderboardDetails.ListOfMarketing[0].ImageURL == null ? "false" : "true");
            this.router.navigateByUrl("/leaderboard-congrats");
          }
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
