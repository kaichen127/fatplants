import { Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MobileService } from 'src/app/services/mobile/mobile.service';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
  animations: [
    trigger('fadeAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(500)
      ]),
      transition(':leave',
        animate(500, style({opacity: 0})))
    ])
  ]
})
export class UploadFilesComponent{

  isUploading: boolean = false;
  isHovering: boolean;
  lab: string = "General";

  constructor(private route:ActivatedRoute,private router:Router,private afs:AngularFirestore,
    private mobileService: MobileService){}
  ngOnInit(){
  }

  get isMobile(): boolean {
    return this.mobileService.isMobile();
  }

  files: File[]=[]

  toggleHover(event:boolean){
    this.isHovering=event;
  }



  onDrop(files:FileList){
    console.log(files);
    for(let i=0;i<files.length;i++){
      this.files.push(files.item(i))
    }
    console.log(this.files);
  }

  removeFile(file: File) {
    this.files.splice(this.files.indexOf(file), 1);
  }
  triggerFileWindow() {
    document.getElementById('fileInput').click();
  }
  // set the class of this div dynamically for mobile devices
  mobilePane() {
    if (this.isMobile) return "mobilePane";
    else return "pane";
  }
}
