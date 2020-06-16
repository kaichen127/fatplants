import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatButton} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-structure-viewer',
  templateUrl: './structure-viewer.component.html',
  styleUrls: ['./structure-viewer.component.scss']
})
export class StructureViewerComponent implements OnInit {

  private pdbLink;
  private pdbId: string;

  constructor(public dialogRef: MatDialogRef<StructureViewerComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer) {
    this.pdbId = data.pdbId;
    this.pdbLink = this.sanitizer.bypassSecurityTrustResourceUrl("/static/display3d.html?pdbId=" + this.pdbId);
   }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
