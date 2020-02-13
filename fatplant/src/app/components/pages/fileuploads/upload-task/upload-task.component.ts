import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { tap, finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.css']
})
export class UploadTaskComponent implements OnInit {

  @Input() file:File;
  @Input() lab:string;
  
  task: AngularFireUploadTask;

  static ctr:number=0;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  constructor(private storage:AngularFireStorage,private afs:AngularFirestore,private route:ActivatedRoute) { }

  ngOnInit() {
    this.startUpload();
  }

  startUpload(){
    const id=this.afs.createId();
    const path='files/'+this.lab+"/"+id+"_"+this.file.name;

    const ref=this.storage.ref(path)

    this.task=this.storage.upload(path,this.file)

    this.percentage=this.task.percentageChanges();

    this.snapshot=this.task.snapshotChanges().pipe(
      tap(console.log),

      finalize(async()=>{
        this.downloadURL=await ref.getDownloadURL().toPromise();
 
        this.afs.collection('Files').doc(id).set({url:this.downloadURL,fileName:this.file.name,lab:this.lab});
      }),
    );
  }

  isActive(snapshot){
    return snapshot.state==='running' &&snapshot.bytesTrasnferred <snapshot.totalBytes;
  }


}
