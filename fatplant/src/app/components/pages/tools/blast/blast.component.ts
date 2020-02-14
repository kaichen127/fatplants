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

  private blast: string;
  private isVisibale: boolean;
  private result: string;
  private isBlastP: boolean;
  private isBlastN: boolean;
  private isGlmol: boolean;
  private glmolUrl: string;
  private blastRes = [];
  blastForm: FormGroup;
  constructor(private http: HttpClient, private router: Router, db: AngularFirestore) {
    // this.blastForm = fb.group({method: ['', Validators.required]});
    // this.blastForm = new FormGroup({
    //   fasta : new FormControl(),
    //   method : new FormControl(),
    //   ProteinDatabase : new FormControl(),
    //   Ethreshold : new FormControl(),
    //   maxhit : new FormControl(),
    //   NucleotideDatabase : new FormControl()
    // });
    this.isVisibale = true;
    this.isBlastP = false;
    this.isBlastN = false;
    this.isGlmol = false;
    // this.items = db.collection('/Lmpd_Arapidopsis').valueChanges();
  }
  onSubmit() {
    // this.http.post('https://linux-shell-test.appspot.com/blastp', {fasta: this.proteinSeq, database: this.database, matrix: this.matrix, evalue: this.evalue}, {responseType: 'text'}).subscribe((res: any) => {
      this.http.get('https://linux-shell-test.appspot.com/blastp?fasta=' + this.proteinSeq + '&database=' + this.database + '&matrix=' + this.matrix + '&evalue=' + this.evalue, {responseType: 'text'}).subscribe((res: any) => {

        this.result = res;
        this.SplitRes(res);
    });
  }
  ngOnInit() {
    // this.blastForm = new FormGroup({});
    this.blast = 'input blast here';
  }

  SelectBlastP() {
    this.isBlastP = true;
    this.isBlastN = false;
    // console.log("select p");
  }
  SplitRes(result: string) {
    this.blastRes = [];
    let tmp: any;
    // tmp = result.match(/>[\s\S]+Lambda/g)
    tmp = result.split('>');
    tmp.shift();
    let index: number;
    index = tmp[tmp.length - 1].search('Lambda');
    tmp[tmp.length - 1] = tmp[tmp.length - 1].substring(0, index);
    // console.log(tmp);
    // let x: any;
    // let t: any;
    // for (x in tmp) {
    //   t = tmp[x].split('\n');
    //   console.log(t);
    //   this.blastRes.push({
    //     title: t[0],
    //     content: t[1]
    //   });
    // }
    this.blastRes = tmp;
  }

}
