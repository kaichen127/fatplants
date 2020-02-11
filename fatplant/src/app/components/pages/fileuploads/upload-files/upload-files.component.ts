import { Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent{

  constructor(private route:ActivatedRoute,private router:Router,private afs:AngularFirestore){}
  lab="General"


  isHovering: boolean;

  files: File[]=[]

  toggleHover(event:boolean){
    this.isHovering=event;
  }

  onDrop(files:FileList){
    for(let i=0;i<files.length;i++){
      this.files.push(files.item(i))
    }
  }
}
