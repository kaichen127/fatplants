import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'app-blast',
  templateUrl: './blast.component.html',
  styleUrls: ['./blast.component.css']
})
export class BlastComponent implements OnInit {

  public method: string;
  public proteinSeq: string;
  public database: string;
  public matrix: string;
  public evalue: string;
  public items: any;

  private isLoading: boolean;
  private result: string;
  private blastRes = [];

  constructor(private http: HttpClient, private router: Router, db: AngularFirestore) {
  }
  onSubmit() {
    // this.http.post('https://linux-shell-test.appspot.com/blastp', {fasta: this.proteinSeq, database: this.database, matrix: this.matrix, evalue: this.evalue}, {responseType: 'text'}).subscribe((res: any) => {
    this.isLoading = true;
    this.http.get('https://us-central1-fatplant-76987.cloudfunctions.net/blastp?fasta=' + this.proteinSeq + '&database=' + this.database + '&matrix=' + this.matrix + '&evalue=' + this.evalue, {responseType: 'text'}).subscribe((res: any) => {
        this.result = res;
        this.SplitRes(res);
    });
  }
  ngOnInit() {
  }

  SplitRes(result: string) {
    this.blastRes = [];
    let tmp: any;
    tmp = result.split('>');
    tmp.shift();
    let index: number;
    index = tmp[tmp.length - 1].search('Lambda');
    tmp[tmp.length - 1] = tmp[tmp.length - 1].substring(0, index);

    for (var i in tmp) {
      this.blastRes.push([tmp[i].split(/\r?\n/)[0],tmp[i]])
    }
    this.isLoading = false
  }
  OnClear(){
    this.proteinSeq = "";
    this.database = undefined;
    this.matrix = undefined;
    this.evalue = undefined;
  }

}
