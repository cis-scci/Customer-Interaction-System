import { Component, OnInit } from '@angular/core';
import { PrimaryHeaderService } from '../layout/primary-header/primary-header.service';
import { GlobalRestService } from '../../services/rest/global-rest.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { FilterService } from '../../services/filter/filter.service';

@Component({
  selector: 'app-leaderboard-congrats',
  templateUrl: './leaderboard-congrats.component.html',
  styleUrls: ['./leaderboard-congrats.component.scss']
})
export class LeaderboardCongratsComponent implements OnInit {
  
  loader: boolean = false;
  selfieFlag = 'false';
  marketingRepId : string = "";

  constructor(private selfieFlagService:FilterService,private http: HttpClient,private restService: GlobalRestService,private toastr: ToastrService,private router:Router, private route: ActivatedRoute, private primaryHeader: PrimaryHeaderService) { }

  ngOnInit() {
    this.marketingRepId = localStorage.getItem("currentUser");
    this.route.params.subscribe(params => {
      this.route.queryParams.subscribe(params => {
        this.selfieFlagService.selfieUploaded.subscribe(value =>{
          //console.log(value)
          this.selfieFlag = value
        } )
     });
    }) 
  }

  addSelfie(event){    
     let file = event.target.files[0];

     if (this.validateFile(file.name)) {
      //if (this.isValidFileSize(file)) {
          let formdata: FormData = new FormData();
          formdata.append('documentfile', file);

            this.loader = true;

            const req = new HttpRequest('POST', "http://udev.scci.co.in:88/CIS/api/StaffDealer/UploadDealerImage/?ImageFileName=" + this.marketingRepId + "&MarketingRepID=" + this.marketingRepId, formdata, {
              reportProgress: true,
              responseType: 'text'
            });
            this.http.request(req).subscribe(event => {          
              let eventObj : any = event;
              if (eventObj.partialText) {
                let statusCode = JSON.parse(eventObj.partialText).rs;
                if (statusCode == "0") {
                    this.loader = false;
                    this.toastr.success("Photo Updated Successfully!!");
                }
                else{
                  this.toastr.error("Some Problem Occured Kindly Try Again Later!!");
                }
              }
            });
      // }
      // else {
      //   this.toastr.error("", "File is too large");
      // }
   }
   
    else {
      this.toastr.error("", "Please choose file in ['jpeg', 'jpg', 'png'] format.");
    }

   }

   isValidFileSize(files) {
    var fileSizeinMB = files.size / 1024;
    var size = Math.round((fileSizeinMB) * 100) / 100; // convert upto 2 decimal place
    if (size >= Number.parseFloat("3072.0")) {

      return false;
    }
    else {
      return true;
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

  viewAll(){
    this.router.navigateByUrl("/leaderboard?backPageFlag=wait" );
  }

}
