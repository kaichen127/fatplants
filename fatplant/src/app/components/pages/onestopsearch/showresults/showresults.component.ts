import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {HttpClient} from "@angular/common/http";
import { Lmpd_Arapidopsis } from '../../../../interfaces/lmpd_Arapidopsis';
import {Observable} from "rxjs";
import {DataService} from "../../../../services/data/data.service";


@Component({
  selector: 'app-showresults',
  templateUrl: './showresults.component.html',
  styleUrls: ['./showresults.component.scss']
})
export class ShowresultsComponent implements OnInit {
  private uniprot_id: any;
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
  private lmpd: Observable<Lmpd_Arapidopsis[]>

  private blastResList=[];
  private showBlastResList=[];

  private pdbList=[];
  private noPdb: boolean;
  private defaultPdb: any;

  private pathwayList=[];
  private pathwayDb=[];


  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private afs: AngularFirestore, private http: HttpClient,private dataService:DataService) { }

  ngOnInit() {


    this.route.params.subscribe(params => {
      this.isSummary = false;
      this.isStructure = false;
      this.isBlast = false;
      this.isPathway = false;

      this.uniprot_id = params['uniprot_id'];
      this.cfg = params['cfg'];

      console.log(this.uniprot_id,this.cfg);
      this.noPdb = false;

      this.href2summary='/showresults/'+ this.uniprot_id + '/summary';
      this.href2structure='/showresults/'+ this.uniprot_id + '/structure';
      this.href2blast='/showresults/'+ this.uniprot_id + '/blast';
      this.href2pathway='/showresults/'+ this.uniprot_id + '/pathway';


      switch (this.cfg) {
        case 'summary':
          this.lmpdCollection = this.afs.collection<Lmpd_Arapidopsis>('/Lmpd_Arapidopsis', ref => ref.limit(1).where('uniprot_id', '==', this.uniprot_id));
          this.lmpd = this.lmpdCollection.valueChanges();
          this.SearchDefaultPDB(this.uniprot_id);
          this.isSummary=true;
          break;
        case 'structure':
          this.SearchPDB(this.uniprot_id);
          this.isStructure=true;

          break;
        case 'blast':
          console.log(this.dataService.uniprot_id);
          if (this.uniprot_id === this.dataService.uniprot_id){
            this.dataService.getBlastRes().subscribe(res=>{
              console.log("get!");
              console.log(res);
            });
          }
          else {
            this.dataService.updateBlastRes(this.uniprot_id).subscribe(res=>{
              console.log("update!");
              console.log(res);
            })
          }
          this.percent=0;
          const getDownloadProgress = () => {
            if (this.percent <= 99) {
              this.percent = this.percent + 10;
            }
            else {
              clearInterval(this.intervalId);
            }
          }
          this.intervalId = setInterval(getDownloadProgress, 500);
          this.showProgress = true;

          this.isBlast=true;
          this.afs.collection('/Lmpd_Arapidopsis', ref => ref.limit(1).where('uniprot_id', '==', this.uniprot_id)).valueChanges().subscribe((dbres: any) => {
            const seq=dbres[0].sequence;
            console.log(dbres);
            const proteindatabase = 'Arabidopsis';
            this.http.get('https://us-central1-fatplant-76987.cloudfunctions.net/oneclick?fasta=' + seq + '&database=' + proteindatabase, { responseType: 'text' }).subscribe((blastres: any) => {
              console.log(blastres);
              this.SplitRes(blastres);
              this.showProgress = false;
              clearInterval(this.intervalId);

            });
          });
          break;
        case 'pathway':
          this.http.get('/static/reactome.csv', { responseType: 'text' }).subscribe(data => {
            for (const line of data.split(/[\r\n]+/)) {
              // console.log(line.split(','));
              this.pathwayDb.push(line.split(','));
            }
          });

          this.isPathway=true;
          break;
        default:
          console.log("wrong config");
      }
    })
  }
  SafeUrl(input: string) {
    // const input1 = "A0JJX5_4p42.1.A_67_560";
    const tmpurl = '/static/viewer.html?' + input;
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }
  SafeImg() {
    const input="R-ATH-1119615.1"
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
  ShowAllBlastRes() {
    this.showBlastResList = this.blastResList.slice(0);
  }
  SearchPDB(uniprot_id: string) {
    this.http.get('/static/uniprot_pdb_list.txt', { responseType: 'text' }).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        if (line.slice(0, 6) === uniprot_id) {
          let tmp = line.slice(0, -4);
          this.pdbList.push(tmp);
          if (tmp.slice(-7, -1) === 'defaul') {
            let swap = this.pdbList[0].toString();
            this.pdbList[0] = tmp;
            this.pdbList[this.pdbList.length - 1] = swap;
          }
        }

      }
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
          this.pdbList.push(tmp);
          if (tmp.slice(-7, -1) === 'defaul') {
            this.defaultPdb=tmp
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
        this.pathwayList.push([this.pathwayDb[index][0], this.pathwayDb[index][1]]);
      }
    }
  }

}
