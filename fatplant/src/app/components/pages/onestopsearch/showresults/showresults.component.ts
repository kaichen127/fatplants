import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {HttpClient} from "@angular/common/http";
import {Location} from '@angular/common';
import { Lmpd_Arapidopsis } from '../../../../interfaces/lmpd_Arapidopsis';
import {Observable} from "rxjs";
import {DataService} from "../../../../services/data/data.service";
import {G2SEntry} from "../../../../interfaces/G2SEntry";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStep } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { StructureViewerComponent } from '../structure-viewer/structure-viewer.component';
import { NotificationService } from 'src/app/services/notification/notification.service';
import {toNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";


@Component({
  selector: 'app-showresults',
  templateUrl: './showresults.component.html',
  styleUrls: ['./showresults.component.scss']
})
export class ShowresultsComponent implements OnInit {
  @Input()
  uniprot_id: any;
  private cfg: string;
  currPath: string;
  uniprot2kegg = {};
  kegg2pathway = {};
  noimg: boolean;
 
  @ViewChild('canvasEl') canvasEl: ElementRef;
  context: CanvasRenderingContext2D;

  @Input() proteinDatabase: any;
  isLoadingImage: boolean;
  percent: number;
  private g2sUrl: string = "https://g2s.genomenexus.org/api/alignments";
  progressBar = document.querySelector('.progress-bar');
  private intervalId: any;
  showProgress: boolean;
  leftArrowEnabled: boolean;
  rightArrowEnabled: boolean;
  isSummary: boolean;
  isStructure: boolean;
  isBlast: boolean;
  isPathway: boolean;
  tairId;

  private href2summary: string;
  private href2structure: string;
  private href2blast: string;
  private href2pathway: string;
  G2SDataSource: MatTableDataSource<G2SEntry>;

  private lmpdCollection: AngularFirestoreCollection<Lmpd_Arapidopsis>;
  //private lmpd: Observable<Lmpd_Arapidopsis[]>
  lmpd: Lmpd_Arapidopsis;

  private blastResList=[];
  showBlastResList=[];

  private pdbList=[];
  noPdb: boolean;
  defaultPdb: any;

  pathwayList=[];
  pathwaylist = [];
  pathwayDb = [];
  pathwaydb = [];
  displayedColumns = ['pdbId', 'pdbNo', 'chain', 'evalue', 'bitscore', 'identity', 'pdbRange', 'seqRange', '3DViewer'];

  get g2sLoading(): boolean {
    return this.dataService.g2sLoading;
  }

  get prettyConfig(): string {
    if (this.cfg != undefined) return this.cfg[0].toUpperCase() + this.cfg.slice(1);
    else return "";
  }

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private afs: AngularFirestore, private http: HttpClient, public dataService: DataService,
    private location: Location, public dialog: MatDialog, public notificationService: NotificationService) {
      this.http.get('/static/reactome.csv', {responseType: 'text'}).subscribe(data => {
        for (const line of data.split(/[\r\n]+/)) {
          // console.log(line.split(','));
          this.pathwaydb.push(line.split(','));
        }
        //console.log(this.pathwaydb);
        this.pathwaydb.sort(function(a, b) {
          if (a[a.length-1] < b[b.length-1]) return -1;
          if (a[a.length-1] > b[b.length-1]) return 1;
          return 0;
        });
      });
      this.http.get('/static/Uniprot2Kegg.csv', {responseType: 'text'}).subscribe(data => {
        for (const line of data.split(/[\r\n]+/)) {
          // console.log(line.split(','));
          this.uniprot2kegg[line.split(',')[0]] = line.split(',')[1];
        }
        //console.log(this.uniprot2kegg);
      });
  
      this.http.get('/static/Kegg2Path.csv', {responseType: 'text'}).subscribe(data => {
        for (const line of data.split(/[\r\n]+/)) {
          // console.log(line.split(','));
          if (this.kegg2pathway[line.split(',')[0]] != null){
            this.kegg2pathway[line.split(',')[0]].push(line.split(',')[1]);
          }
          else{
            this.kegg2pathway[line.split(',')[0]]=[line.split(',')[1]];
          }
        }
        //console.log(this.kegg2pathway);
      });

      setTimeout(() => {
        this.pathwaylist = this.kegg2pathway[this.uniprot2kegg[this.uniprot_id]];
      }, 1000);
    }

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
      this.SelectConfig();
    });
  }

  SearchUniprot() {
    for (var index in this.pathwaydb) {
        if (this.pathwaydb[index][this.pathwaydb[index].length-1] === this.uniprot_id) {
          this.pathwayList.push({id:this.pathwaydb[index][0],name:this.pathwaydb[index][1],url:this.SafeImg(this.pathwaydb[index][0])});
        }
    }
    setTimeout(() => {
      console.log('timeout');

      if (this.pathwayList.length === 0) {
        console.log('No image');
        this.noimg = true;
      }
    }, 5000);
  }

  public checkLmpd() {
    this.noPdb = false;

      if(this.uniprot_id === this.dataService.uniprot_id && !this.dataService.loading){
        console.log("get lmpd");
        this.lmpd = this.dataService.getLmpdData();
        this.tairId = this.lmpd.tair_ids;
        this.SearchDefaultPDB(this.uniprot_id);
        this.SelectConfig();
        this.searchG2S();
      }
      else{
        console.log("update lmpd");
        this.dataService.loading = true;
        this.dataService.getDataFromAbs(this.uniprot_id).subscribe(res=>{
          this.dataService.seqence = res[0].sequence;
          this.dataService.lmpd = res[0];
          this.dataService.BlastNeedUpdate = true;
          this.lmpd = res[0];
          this.tairId = this.lmpd.tair_ids;
          this.SearchDefaultPDB(this.uniprot_id);
          this.dataService.loading = false;
          this.SelectConfig();
          this.searchG2S();
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
    console.log(this.cfg);
    switch (this.cfg) {
      case 'summary':
        this.isSummary = true;
        break;
      case 'structure':
        this.pdbList = [];
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
          this.intervalId = setInterval(getDownloadProgress, 700);
          this.isBlast = true;
          this.showProgress = true;
          if(this.proteinDatabase === undefined){
            this.proteinDatabase = 'Arabidopsis';
          }
          console.log(this.proteinDatabase);
          this.dataService.updateBlastRes(this.uniprot_id, this.proteinDatabase).subscribe(res=>{
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
        break;
    }
    // update arrows
    switch (this.cfg) {
      case "summary":
        this.leftArrowEnabled = false;
        this.rightArrowEnabled = true;
        break;
      case "structure":
        this.leftArrowEnabled = true;
        this.rightArrowEnabled = true;
        break;
      case "blast":
        this.leftArrowEnabled = true;
        this.rightArrowEnabled = true;
        break;
      case "pathway":
        this.leftArrowEnabled = true;
        this.rightArrowEnabled = false;
        break;
      default:
        this.leftArrowEnabled = false;
        this.rightArrowEnabled = true;
        break;
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
  SafeViewer(url: string) {
    const tmpurl = '/static/display3d.html?url=' + url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }
  SplitRes(result: string) {
    //console.log(result);
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
      if (this.pdbList.length === 0 && this.defaultPdb == undefined) {
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
          }
        }

      }
      if (this.defaultPdb === undefined) {
        this.noPdb = true;
      }
    });
  }
  SearchPathway(id: string) {
    console.log(this.tairId);
    for (var index in this.pathwayDb) {
      if (this.pathwayDb[index][4] === id) {
        this.pathwayList.push({id:this.pathwayDb[index][0],name:this.pathwayDb[index][1],url:this.SafeImg(this.pathwayDb[index][0])});
      }
      else{
        for(var i in this.tairId){
          if (this.tairId[i].split('.')[0] === this.pathwayDb[index][3]){
            this.pathwayList.push({id:this.pathwayDb[index][0],name:this.pathwayDb[index][1],url:this.SafeImg(this.pathwayDb[index][0])});
          }
        }
      }
    }
  }

  searchG2S() {
    this.dataService.g2sLoading = true;
    this.http.get(this.g2sUrl + "?sequence=" + this.dataService.seqence).subscribe((result : G2SEntry[]) => {
      this.G2SDataSource = new MatTableDataSource(result);
      if (result != undefined && result.length >= 1) {
        this.defaultPdb = this.sanitizer.bypassSecurityTrustResourceUrl("/static/display3d.html?pdbId=" + result[0].pdbId);
        this.noPdb = false;
      }

      this.dataService.g2sLoading = false;
    }, error => {
      console.log('g2s error');
      this.dataService.g2sLoading = false;
    });
  }

  showViewer(pdbId: string) {
    this.dialog.open(StructureViewerComponent, {
      width: '1000px',
      height: '700px',
      data: {pdbId: pdbId}
    });
  }

  arrowSelect(arrow: string, summaryStep: MatStep, structureStep: MatStep, blastStep: MatStep, pathwayStep: MatStep) { // arrow = "left" or "right" depending on what arrow was clicked
    if (arrow == "left") {
      switch (this.cfg) {
        case "summary":
          break;
        case "structure":
          summaryStep.select();
          // this.changeConfig("summary");
          break;
        case "blast":
          structureStep.select();
          // this.changeConfig("structure");
          break;
        case "pathway":
          blastStep.select();
          // this.changeConfig("blast");
          break;
      }
    }
    else {
      switch (this.cfg) {
        case "summary":
          structureStep.select();
          // this.changeConfig("structure");
          break;
        case "structure":
          blastStep.select();
          // this.changeConfig("blast");
          break;
        case "blast":
          pathwayStep.select();
          // this.changeConfig("pathway");
          break;
        case "pathway":
          break; // should not happen
      }
    }
  }

  loadImage(pathway){
    //var id = selected[0]._value.slice(5);
    this.isLoadingImage = true;
    var id = pathway;
    // console.log(selected[0]._value);
    // if (id === null || id.length < 1){
    //   return;
    // }

    //TODO
    //Clear canvas before load new image
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    var canvas = (this.canvasEl.nativeElement as HTMLCanvasElement);
    this.context.clearRect(0,0,canvas.width,canvas.height);
    var elemLeft = canvas.offsetLeft + canvas.clientLeft;
    var elemTop = canvas.offsetTop + canvas.clientTop;
    var elements = [];
    //this.http.get('https://us-central1-linux-shell-test.cloudfunctions.net/keggget?cfg=get&para=conf&id='+id, {responseType: 'text'}).subscribe(data => {
      this.http.get('https://us-central1-fatplantsmu-eb07c.cloudfunctions.net/keggget?cfg=get&para=conf&id='+id, {responseType: 'text'}).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        if (line.slice(0, 4) === 'rect') {
          var linesplit = line.split('\t');
          var pos = linesplit[0];
          var url = linesplit[1];
          var possplit = pos.split(' ');
          var topleft = possplit[1];
          var bottomright = possplit[2];
          topleft = topleft.slice(1,-1);
          bottomright = bottomright.slice(1,-1);
          var top = toNumbers(topleft.split(',')[1])[0];
          var left = toNumbers(topleft.split(',')[0])[0];
          var bottom = toNumbers(bottomright.split(',')[1])[0];
          var right = toNumbers(bottomright.split(',')[0])[0];
          elements.push({
            colour: '#FFFFFF',
            width: right-left,
            height: bottom-top,
            top: top,
            left: left,
            url: url
          })

        }
      }
      canvas.addEventListener('click',function(event) {
        // var x = event.pageX - elemLeft;
        // var y = event.pageY - elemTop;
        var x = event.offsetX
        var y = event.offsetY
        console.log(event);
        console.log(elemLeft);
        console.log(elemTop);
        // Collision detection between clicked offset and element.

        elements.forEach(function(element) {
          if (y > element.top && y < element.top + element.height
            && x > element.left && x < element.left + element.width) {
            //alert('clicked an element');
            window.open('http://www.kegg.jp'+element.url);

          }
        })},false);

      canvas.addEventListener('mousemove',function(event) {
        var x = event.offsetX;
        var y = event.offsetY;
        var isIn = false;
        elements.forEach(function(element) {
          if (y > element.top && y < element.top + element.height
            && x > element.left && x < element.left + element.width) {
            isIn = true;
            canvas.style.cursor = "pointer";
          }
        })
        if (!isIn){
          canvas.style.cursor = "default";
        }
      },false);

      var ctx = this.context;
      elements.forEach(function(element) {
        ctx.fillStyle = element.colour;
        ctx.fillRect(element.left, element.top, element.width, element.height);
      });​

      // var img1 = document.getElementById('pathway1') as HTMLImageElement;
      // ctx.drawImage(img1,0,0);
      var img1 = new Image();
      img1.onload = () => {
        this.isLoadingImage = false;
        ctx.canvas.height = img1.height;
        ctx.canvas.width = img1.width;
        ctx.drawImage(img1,0,0)
        // THESE LINES WOULD SCALE THE IMAGE DOWN
        // if so, set the max height/width in the html
        /* var scale = Math.min(canvas.width / img1.width, canvas.height / img1.height);
        // get the top left position of the image
        var x = (canvas.width / 2) - (img1.width / 2) * scale;
        var y = (canvas.height / 2) - (img1.height / 2) * scale;
        ctx.drawImage(img1, x, y, img1.width * scale, img1.height * scale);
        */
      
      }
        //img1.src = 'https://us-central1-linux-shell-test.cloudfunctions.net/keggget?cfg=get&para=image&id=' + id;
        img1.src = 'https://us-central1-fatplantsmu-eb07c.cloudfunctions.net/keggget?cfg=get&para=image&id=' + id;

    });
  }

}
