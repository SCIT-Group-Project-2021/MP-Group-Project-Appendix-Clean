import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-error-dialog',
  templateUrl: './register-error-dialog.component.html',
  styleUrl: './register-error-dialog.component.scss'
})
export class RegisterErrorDialogComponent implements OnInit {
  dialogTitle!: string;
  dialogText!: string;

  constructor(
    public dialogRef: MatDialogRef<RegisterErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}


  ngOnInit() {
    this.dialogTitle = this.data.dialogTitle;
    this.dialogText = this.data.dialogText;
    console.log(this.dialogText + ", " + this.data.dialogText + " in dialog test")
  }



}
