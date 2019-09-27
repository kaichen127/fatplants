import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.css']
})
export class DataAnalysisComponent implements OnInit {
  private blast: string;
  private isVisibale: boolean;
  constructor() {
    // let childprocess=require('child_process');
    // let options:string[]=[];
    // cp.exec('python',function (err,stdout) {console.log(stdout);});
  }

  ngOnInit() {
    this.blast = "input blast here";
    this.isVisibale = false;
  }
  debug(){
    // console.log(msg);
    let options:string[]=[];
    //this.childProcessService.childProcess.exec("python",options,(data) => {console.log(data);});

  }
  SetVisiable(){
    this.isVisibale=!this.isVisibale;
  }
}
