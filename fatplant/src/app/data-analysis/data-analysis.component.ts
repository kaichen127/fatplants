import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';


@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.css']
})
export class DataAnalysisComponent implements OnInit {
  private blast: string;
  private isVisibale: boolean;
  private result: string;
  private isBlastP: boolean;
  private isBlastN: boolean;
  private isGlmol: boolean;
  private glmolUrl: string;
  blastForm: FormGroup;
  constructor(private http: HttpClient, private router: Router) {
    // this.blastForm = fb.group({method: ['', Validators.required]});
    this.blastForm = new FormGroup({
      fasta : new FormControl(),
      method : new FormControl(),
      ProteinDatabase : new FormControl(),
      Ethreshold : new FormControl(),
      maxhit : new FormControl(),
      NucleotideDatabase : new FormControl()
    });
    this.isVisibale = true;
    this.isBlastP = false;
    this.isBlastN = false;
    this.isGlmol = false;
  }
  onSubmit(blastData) {
    console.log(blastData);
    // console.log(this.http.get('linux-shell-test.appspot.com'));
    // this.router.navigateByUrl('/app-data-analysis');
    // this.http.get('/test?q=Glyma14g08610.1').subscribe((res: Response) => {console.log(res); });
    // this.http.get('/ng/index').subscribe((res: Response) => {console.log(res); });
    // this.http.post('/blastp', blastData).subscribe((res: Response) => {console.log(res); });
    this.http.post('/test', blastData).subscribe((res: any) => {
      this.result = res.result;
      console.log(res.result);
      this.ShowResult(res.result);
      // this.router.navigateByUrl('/result');
    });
  }
  ngOnInit() {
    // this.blastForm = new FormGroup({});
    this.blast = 'input blast here';

  }
  debug() {
    // console.log(msg);
    const options: string [] = [];
    // this.childProcessService.childProcess.exec("python",options,(data) => {console.log(data);});

  }
  SelectBlastP() {
    this.isBlastP = true;
    this.isBlastN = false;
    // console.log("select p");
  }
  SelectBlastN() {
    this.isBlastN = true;
    this.isBlastP = false;
    // console.log("select n");
  }
  ShowResult(result: string) {
    const newWindow = window.open('Result', '_blank');
    newWindow.document.write('<p style="white-space: pre-line">' + result + '</p>');
  }
  showGlmol() {
    const newWindow = window.open('Result', '_blank');
    // console.log(this.glmolUrl);
    let tmp: string;
    tmp = this.glmolUrl;
    tmp = tmp.replace('.', '_');
    let url = 'http://soykb.org/search/glmol/viewer.html?' + tmp + '.pdb'
    // this.glmolUrl = '"http://soykb.org/search/glmol/viewer.html?Glyma14g08610_1.pdb"';
    newWindow.document.write('<iframe src="' + url + '" style="width: 100%" height="768"></iframe>');
    // this.isGlmol = true;
  }
}
