import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-error-dialog',
  templateUrl: './login-error-dialog.component.html',
  styleUrl: './login-error-dialog.component.scss'
})
export class LoginErrorDialogComponent implements OnInit {
  dialogTitle!: string;
  dialogText!: string;

  constructor(
    public dialogRef: MatDialogRef<LoginErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit() {
    this.dialogTitle = this.data.dialogTitle;
    this.dialogText = this.data.dialogText;
  }
}
