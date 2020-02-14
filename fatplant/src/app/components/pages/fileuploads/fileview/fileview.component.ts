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
    "Dong Xu":[],
    "Jay Thelen":[],
    "Abe Koo":[],
    "General":[],
    "Douglas Allen":[],
    "Philip Bates":[]
  }

  get displayFiles() {
    return this.files[this.labname];
  }

  labname: string = '';

  constructor(private afs:AngularFirestore) {
    let subscriptionDX=this.afs.collection('Files',ref=>ref.where("lab","==","Dong_Xu")).valueChanges().subscribe((data)=>{
      this.files["Dong Xu"]=data;
    })
    let subscriptionAK=this.afs.collection('Files',ref=>ref.where("lab","==","Abe_Koo")).valueChanges().subscribe((data)=>{
      this.files["Abe Koo"]=data;
    })
    let subscriptionJT=this.afs.collection('Files',ref=>ref.where("lab","==","Jey_Thelen")).valueChanges().subscribe((data)=>{
      this.files["Jay Thelen"]=data;
    })
    let subscriptionG=this.afs.collection('Files',ref=>ref.where("lab","==","General")).valueChanges().subscribe((data)=>{
      this.files["General"]=data;
    })
    let subscriptionDA=this.afs.collection('Files',ref=>ref.where("lab","==","Douglas_Allen")).valueChanges().subscribe((data)=>{
      this.files["Douglas Allen"]=data;
    })
    let subscriptionPH=this.afs.collection('Files',ref=>ref.where("lab","==","Philip_Bates")).valueChanges().subscribe((data)=>{
      this.files["Philip Bates"]=data;
    })
   }

  ngOnInit() {
  }

  openFolder(folder: string) {
    this.labname = folder;
  }

}
