import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  public popup(message: string) {
    this._snackBar.open(message, null, {
      duration: 2500
    });
  }
}
