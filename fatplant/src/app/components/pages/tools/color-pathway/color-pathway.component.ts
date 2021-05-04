import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import { Lmpd_Arapidopsis } from 'src/app/interfaces/lmpd_Arapidopsis';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import {toNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";
@Component({
  selector: 'app-color-pathway',
  templateUrl: './color-pathway.component.html',
  styleUrls: ['./color-pathway.component.scss']
})
export class ColorPathwayComponent implements OnInit {
  // @ts-ignore
  @ViewChild('canvasEl') canvasEl: ElementRef;
  context: CanvasRenderingContext2D;
  uniprot2kegg = {};
  kegg2pathway = {};
  currPath: string;

  noimg: boolean;
  isLoadingImage: boolean = false;
  private imgs = [];
  uniprot: string;
  private debug: boolean;
  loading = false;
  searchQuery: string;
  private pathwaydb = [];
  //private items: Observable<Lmpd_Arapidopsis[]>;
  items = [];

  private imgUrl: SafeResourceUrl;
  private imgID: string;
  private showImg: boolean;
  private showLinkList: boolean;
  private defaultValue1 = 'null';
  private defaultValue2 = 'null';
  private linkList = [];
  pathwayList = [];

  constructor(private sanitizer: DomSanitizer, private http: HttpClient, private afs: AngularFirestore) {
    this.pathwaydb = [];
    this.uniprot2kegg = {};
    this.kegg2pathway = {};

    this.searchQuery = undefined;
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
  }

  ngOnInit() {

  }
  public OnSubmit() {
    // this.loading = true;
    // this.debug = false;
    // this.pathwayList = [];
    // this.noimg = false;
    // this.searchQuery = this.uniprot;
    // this.SearchUniprot(this.uniprot);
    this.pathwayList = this.kegg2pathway[this.uniprot2kegg[this.uniprot]];
  }
  SafeImg(input: string) {
    //const tmpurl = '/static/pathway.html?id=' + input;
    const tmpurl = 'https://us-central1-fatplant-76987.cloudfunctions.net/keggget?cfg=get&para=image&id=' + input;
    //const tmpurl = 'https://us-central1-linux-shell-test.cloudfunctions.net/keggget?cfg=get&para=image&id=' + input;
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }

  Search() {
    if (this.uniprot == '') { return; }
    else {
      this.items = [];
      for (var key in this.uniprot2kegg){
        if (this.uniprot <= key && this.uniprot+'\uf8ff' >= key && this.uniprot2kegg[key]!='#N/A'){
          this.items.push(key);
        }
      }
      //console.log(this.items);
      //this.items = this.afs.collection<Lmpd_Arapidopsis>('/Lmpd_Arapidopsis', ref => ref.limit(10).where('uniprot_id', '>=', this.uniprot.toUpperCase()).where('uniprot_id', '<=', this.uniprot + '\uf8ff')).valueChanges();
    }
  }

  SearchUniprot(id: string) {
    for (var index in this.pathwaydb) {
        if (this.pathwaydb[index][this.pathwaydb[index].length-1] === id) {
          this.pathwayList.push({id:this.pathwaydb[index][0],name:this.pathwaydb[index][1],url:this.SafeImg(this.pathwaydb[index][0])});
        }
      if (this.pathwayList.length != 0) this.loading = false;
    }
    setTimeout(() => {
      console.log('timeout');

      if (this.pathwayList.length === 0) {
        console.log('No image');
        this.noimg = true;
      }
      this.loading = false;
    }, 5000);
    this.debug = true;

  }
  setDefaultSearch() {
    this.uniprot = "A8MR93";
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
      this.http.get('https://us-central1-fatplant-76987.cloudfunctions.net/keggget?cfg=get&para=conf&id='+id, {responseType: 'text'}).subscribe(data => {
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
        img1.src = 'https://us-central1-fatplant-76987.cloudfunctions.net/keggget?cfg=get&para=image&id=' + id;

    });
  }
}
