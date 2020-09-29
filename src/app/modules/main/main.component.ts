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
    
    this.primaryHeader.pageTitle.next("Secondary Sales Information and Management Console");
  }
  public showMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    document.querySelector('body').classList.add('az-iconbar-show');
  }

  width = 600;
  height = 400;
  type = "spline";
  dataFormat = "json";
  dataSource = chartData;



}


const chartData = {
  chart: {
    caption: "Average Monthly Temperature in Texas",
    yaxisname: "Average Monthly Temperature",
    anchorradius: "5",
    plottooltext: "Average temperature in $label is <b>$dataValue</b>",
    showhovereffect: "1",
    showvalues: "0",
    numbersuffix: "°C",
    theme: "fusion",
    anchorbgcolor: "#72D7B2",
    palettecolors: "#72D7B2"
  },
  data: [
    {
      label: "Jan",
      value: "1"
    },
    {
      label: "Feb",
      value: "5"
    },
    {
      label: "Mar",
      value: "10"
    },
    {
      label: "Apr",
      value: "12"
    },
    {
      label: "May",
      value: "14"
    },
    {
      label: "Jun",
      value: "16"
    },
    {
      label: "Jul",
      value: "20"
    },
    {
      label: "Aug",
      value: "22"
    },
    {
      label: "Sep",
      value: "20"
    },
    {
      label: "Oct",
      value: "16"
    },
    {
      label: "Nov",
      value: "7"
    },
    {
      label: "Dec",
      value: "2"
    }
  ]
};