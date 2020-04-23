import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-structure-viewer',
  templateUrl: './structure-viewer.component.html',
  styleUrls: ['./structure-viewer.component.scss']
})
export class StructureViewerComponent implements OnInit {

  private pdbLink;
  constructor(public dialogRef: MatDialogRef<StructureViewerComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer) {
    this.pdbLink = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.musite.net/display3d.html?url=rcsb://" + data.pdbId + "&sele=&position=");
   }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
