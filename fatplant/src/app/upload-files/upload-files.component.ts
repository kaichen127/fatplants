import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent{

  isUploading: boolean = false;
  isHovering: boolean;
  lab: string = "General";

  constructor(private route:ActivatedRoute,private router:Router,private afs:AngularFirestore){}
  ngOnInit(){
  }


  files: File[]=[]

  toggleHover(event:boolean){
    this.isHovering=event;
  }



  onDrop(files:FileList){
    for(let i=0;i<files.length;i++){
      this.files.push(files.item(i))
    }
  }

  removeFile(file: File) {
    this.files.splice(this.files.indexOf(file), 1);
  }
}
