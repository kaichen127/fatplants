import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-fileview',
  templateUrl: './fileview.component.html',
  styleUrls: ['./fileview.component.css']
})
export class FileviewComponent implements OnInit {

  folders=["Dong Xu","Jay Thelen","Douglas Allen","Philip Bates","Abe Koo","General"]

  files={
    Dong_Xu:[],
    Jay_Thelen:[],
    Abe_Koo:[],
    General:[],
    Douglas_Allen:[],
    Philip_Bates:[]
  }
  constructor(private afs:AngularFirestore) {
    let subscriptionDX=this.afs.collection('Files',ref=>ref.where("lab","==","Dong_Xu")).valueChanges().subscribe((data)=>{
      this.files.Dong_Xu=data;
    })
    let subscriptionAK=this.afs.collection('Files',ref=>ref.where("lab","==","Abe_Koo")).valueChanges().subscribe((data)=>{
      this.files.Abe_Koo=data;
    })
    let subscriptionJT=this.afs.collection('Files',ref=>ref.where("lab","==","Jey_Thelen")).valueChanges().subscribe((data)=>{
      this.files.Jay_Thelen=data;
    })
    let subscriptionG=this.afs.collection('Files',ref=>ref.where("lab","==","General")).valueChanges().subscribe((data)=>{
      this.files.General=data;
    })
    let subscriptionDA=this.afs.collection('Files',ref=>ref.where("lab","==","Douglas_Allen")).valueChanges().subscribe((data)=>{
      this.files.Douglas_Allen=data;
    })
    let subscriptionPH=this.afs.collection('Files',ref=>ref.where("lab","==","Philip_Bates")).valueChanges().subscribe((data)=>{
      this.files.Philip_Bates=data;
    })
   }

  ngOnInit() {
  }

}
