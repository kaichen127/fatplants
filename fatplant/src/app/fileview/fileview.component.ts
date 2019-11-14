import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fileview',
  templateUrl: './fileview.component.html',
  styleUrls: ['./fileview.component.css']
})
export class FileviewComponent implements OnInit {

  constructor(private afs:AngularFirestore) {
    let subscription=this.afs.collection('Files').valueChanges().subscribe((data)=>{
      this.files=data;
    })
   }

  files=new Array()

  ngOnInit() {
  }

}
