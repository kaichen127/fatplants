import { Component, OnInit, Input } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {HttpClient} from "@angular/common/http";
import {Location} from '@angular/common';
import { Lmpd_Arapidopsis } from '../../../../interfaces/lmpd_Arapidopsis';
import {Observable} from "rxjs";
import {DataService} from "../../../../services/data/data.service";


@Component({
  selector: 'app-showresults',
  templateUrl: './showresults.component.html',
  styleUrls: ['./showresults.component.scss']
})
export class ShowresultsComponent implements OnInit {
  @Input()
  uniprot_id: any;
  private cfg: any;

  private percent: number;
  progressBar = document.querySelector('.progress-bar');
  private intervalId: any;
  private showProgress: boolean;

  private isSummary: boolean;
  private isStructure: boolean;
  private isBlast: boolean;
  private isPathway: boolean;

  private href2summary: string;
  private href2structure: string;
  private href2blast: string;
  private href2pathway: string;

  private lmpdCollection: AngularFirestoreCollection<Lmpd_Arapidopsis>;
  //private lmpd: Observable<Lmpd_Arapidopsis[]>
  private lmpd: Lmpd_Arapidopsis;

  private blastResList=[];
  private showBlastResList=[];

  private pdbList=[];
  private noPdb: boolean;
  private defaultPdb: any;

  private pathwayList=[];
  private pathwayDb=[];


  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private afs: AngularFirestore, private http: HttpClient,private dataService:DataService,
    private location: Location) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.isSummary = false;
      this.isStructure = false;
      this.isBlast = false;
      this.isPathway = false;

      this.pathwayDb = [];
      this.pathwayList = [];
      this.pdbList = [];

      if (this.uniprot_id == undefined) this.uniprot_id = params['uniprot_id'];
      this.cfg = params['cfg'];
      if (this.cfg == undefined) this.cfg = "summary";
      //this.lmpd = new Observable<Lmpd_Arapidopsis[]>();
      //this.lmpd = new Lmpd_Arapidopsis();
      this.checkLmpd();
    });
  }

  public checkLmpd() {
    this.noPdb = false;

      if(this.uniprot_id === this.dataService.uniprot_id && !this.dataService.loading){
        console.log("get lmpd");
        this.lmpd = this.dataService.getLmpdData();
        this.SearchDefaultPDB(this.uniprot_id);
        this.SelectConfig();
      }
      else{
        console.log("update lmpd");
        this.dataService.loading = true;
        this.dataService.getDataFromAbs(this.uniprot_id).subscribe(res=>{
          this.dataService.seqence = res[0].sequence;
          this.dataService.lmpd = res[0];
          this.dataService.BlastNeedUpdate = true;
          this.lmpd = res[0];
          this.SearchDefaultPDB(this.uniprot_id);
          this.dataService.loading = false;
          this.SelectConfig();
          
        });
      }
  }

  changeConfig(newConfig: string) {
    newConfig = newConfig.toLowerCase();
    switch (this.cfg) {
      case 'summary':
        this.isSummary = false;
        break;
      case 'structure':
        this.isStructure = false;
        break;
      case 'blast':
        this.isBlast = false;
        break;
      default:
        this.isPathway = false;
        break;
    }
    this.cfg = newConfig;
    this.location.replaceState('/one-click/' + this.uniprot_id + '/' + this.cfg);
    this.SelectConfig();
  }
  SelectConfig() {
    switch (this.cfg) {
      case 'summary':
        this.isSummary = true;
        break;
      case 'structure':
        this.SearchPDB(this.uniprot_id);
        this.isStructure=true;

        break;
      case 'blast':
        if (!this.dataService.BlastNeedUpdate){
          console.log("get BlastRes");
          this.SplitRes(this.dataService.getBlastRes());
          this.isBlast = true;
        }
        else {
          console.log("update BlastRes");
          this.percent=0;
          const getDownloadProgress = () => {
            if (this.percent <= 99) {
              this.percent = this.percent + 10;
            }
            else {
              clearInterval(this.intervalId);
            }
          };
          this.intervalId = setInterval(getDownloadProgress, 500);
          this.isBlast = true;
          this.showProgress = true;
          this.dataService.updateBlastRes(this.uniprot_id).subscribe(res=>{
            this.SplitRes(res);
            this.showProgress = false;
            clearInterval(this.intervalId);

          });
        }

        break;
      case 'pathway':
        this.pathwayDb = this.dataService.getPathwayDB();
        this.SearchPathway(this.uniprot_id);
        this.isPathway=true;
        break;
      default:
        console.log("wrong config");
    }
  }
  SafeUrl(input: string) {
    // const input1 = "A0JJX5_4p42.1.A_67_560";
    const tmpurl = '/static/viewer.html?' + input;
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }
  SafeImg(input: string) {
    //const input="R-ATH-1119615.1"
    const tmpurl = '/static/pathway.html?id=' + input;
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }
  SplitRes(result: string) {
    this.blastResList = [];
    this.showBlastResList = [];
    let tmp: any;
    tmp = result.split('>');
    tmp.shift();
    let index: number;
    index = tmp[tmp.length - 1].search('Lambda');
    tmp[tmp.length - 1] = tmp[tmp.length - 1].substring(0, index);

    //this.blastResList = tmp.slice(0);
    //console.log(this.blastResList);
    // tmp.length = 5 ;
    // this.showBlastResList = tmp.slice(0, 3);
    //
    // this.showBlastResList[0].split(/\r?\n/)[0];

    for (var i in tmp) {
      //console.log(tmp[i]);
      this.showBlastResList.push([tmp[i].split(/\r?\n/)[0],tmp[i]])
      }
    //console.log(this.blastResList);
  }

  SearchPDB(uniprot_id: string) {
    this.http.get('/static/uniprot_pdb_list.txt', { responseType: 'text' }).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        if (line.slice(0, 6) === uniprot_id) {
          let tmp = line.slice(0, -4);
          this.pdbList.push({name:tmp,url:this.SafeUrl(tmp)});
          if (tmp.slice(-7, -1) === 'defaul') {
            let swap = this.pdbList[0];
            this.pdbList[0] = {name:tmp,url:this.SafeUrl(tmp)};
            this.pdbList[this.pdbList.length - 1] = swap;
          }
        }

      }
      console.log(this.pdbList);
      if (this.pdbList.length === 0) {
        this.noPdb = true;
      }
    });
  }

  SearchDefaultPDB(uniprot_id: string) {
    this.http.get('/static/uniprot_pdb_list.txt', { responseType: 'text' }).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        if (line.slice(0, 6) === uniprot_id) {
          let tmp = line.slice(0, -4);
          this.pdbList.push({name:tmp,url:this.SafeUrl(tmp)});
          if (tmp.slice(-7, -1) === 'defaul') {
            this.defaultPdb=this.SafeUrl(tmp);
          }
        }

      }
      if (this.defaultPdb === undefined) {
        this.noPdb = true;
      }
    });
  }
  SearchPathway(id: string) {
    for (var index in this.pathwayDb) {
      if (this.pathwayDb[index][4] === id) {
        this.pathwayList.push({id:this.pathwayDb[index][0],name:this.pathwayDb[index][1],url:this.SafeImg(this.pathwayDb[index][0])});
      }
    }
  }

}
