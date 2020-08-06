import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MobileService} from '../../../services/mobile/mobile.service';
import { AngularFirestore } from 'angularfire2/firestore';
import {NotificationService} from '../../../services/notification/notification.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss']
})
export class AddNewsComponent implements OnInit {

  isUploading: boolean = false;
  isHovering: boolean;
  title = '';
  link = '';
  lab = 'General';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private afs: AngularFirestore,
              private notification: NotificationService,
              private mobileService: MobileService){}
  ngOnInit(){
  }

  get isMobile(): boolean {
    return this.mobileService.isMobile();
  }

  files: File[] = [];

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

  uploadNews() {
    this.afs.collection('Files', ref => ref.where('fileName', '==', this.files[0].name)).get().subscribe(res => {
      this.afs.collection('News').add({
        title: this.title,
        timestamp: firebase.firestore.Timestamp.now(),
        link: this.link,
        img: res.docs[0].data().url
      }).then(ret => {
        this.notification.popup('News was successfully uploaded');
        this.title = '';
        this.link = '';
        this.files = [];
        this.router.navigate(['/homepage']);
      });
    })
  }
}
