import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators,FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RegisterErrorDialogComponent } from '../register-error-dialog/register-error-dialog.component';
import { Firestore, setDoc, doc, collection, addDoc } from '@angular/fire/firestore';
import { getStorage, ref } from '@angular/fire/storage'

@Component({
  selector: 'app-register-pane',
  templateUrl: './register-pane.component.html',
  styleUrl: './register-pane.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({opacity: 0,transform: 'translate(1000px)'})) ,
      transition('void <=> *',[
        animate('.2s')
      ])
    ]),
    trigger('invert', [
      state('void', style({backgroundColor: 'white',transform: 'translate(-1000px)'})) ,
      transition('void <=> *',[
        animate('.2s')
      ])
    ])]
})

export class RegisterPaneComponent implements OnInit {
  result: any;
  form!: FormGroup;
  isRegistering = false;
  hide = true;
  alertTitle = "";
  alertMessage = "";
  userUid = "";
  storage = getStorage();


  constructor(
    private router: Router,
    private formBuilder : FormBuilder,
    private dialog : MatDialog,
    private registerAuth : AngularFireAuth,
    private firestore : Firestore
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['',[Validators.required]],
      fName: ['',[Validators.required]],
      lName: ['',[Validators.required]],
      dob: ['',[Validators.required]]
    })
  }

  register(){
    this.isRegistering = true;
    const email = this.form.value.email;
    const  password = this.form.value.password;
    console.log(this.alertTitle +" test 3");
    this.registerAuth.createUserWithEmailAndPassword(email,password).then((authUser) =>{
      authUser.user?.updateProfile({
        // TODO: Set a default picture
        displayName: this.form.value.fName,
        photoURL : ''
      }).then(() =>{
        authUser.user?.reload();
        console.log("Profile updated");

        // TODO: Set up scheduled delete function if user does not verify email
        // TODO: Allow users to resend email
        authUser.user?.sendEmailVerification();
        const userData = {
          name : {first : this.form.value.fName, last : this.form.value.lName},
          dateOfBirth : this.form.value.dob,
          learnerType: "undefined",
          lastLogInDate: "undefined",
          completedQuizzes: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalSessions : 0
        }

        const courseData = {
          correctQ : 0,
          feedback : "",
          goalDaysLeft: 0,
          avg : 0
        }

        if(typeof authUser.user?.uid != "undefined"){
          this.userUid = authUser.user?.uid;
          console.log("User Uid = " + this.userUid)
        }
        else{
          console.log("User uid undefined")
          throw "auth/uid-not-found";
        }
        const createCourseData = doc(this.firestore, `users/${(this.userUid).toString()}/courses/college-math`);
        setDoc(createCourseData, courseData);

        setDoc(doc(this.firestore, "users", (this.userUid).toString()), userData);

      }).catch((error) =>{
        console.log("Display name error: " + error.code);
        console.log(error);
      })

     this.alertTitle = "Verify your email";
     this.alertMessage = "We sent you an email to verify your email address and activate your account. If you don't see the email, try checking spam.";

     this.router.navigate(['']);


    }).catch((err) =>{
      switch (err.code){
        case "auth/email-already-exists":
          case "auth/email-already-in-use":
        {
          this.alertTitle = "Invalid Email"
          this.alertMessage = "Email already exists!";
          break;
        }

        case "auth/invalid-password":
        case "auth/weak-password":
        {
          this.alertTitle = "Invalid Password"
          this.alertMessage = "Password is too short. It must be at least 6 characters.";
          console.log(this.alertTitle +" test 2");
          break;
        }

        default:
        {
          this.alertTitle = "Unexpected Error";
          this.alertMessage = "Please try again.";
          break;
        }
      }

    }).finally(() =>{
      this.isRegistering = false;
      console.log(this.alertTitle +" test 3");
      this.openDialog(this.alertTitle, this.alertMessage)
    })
  }

  openDialog(title : string, msg: string) : void {
    const dialogRef = this.dialog.open(RegisterErrorDialogComponent, {
      data: {dialogTitle: title, dialogText: msg}
    })
  }



  toLogIn(){
    if (true) {
      this.router.navigate(['']);
    }
  }
}



  //#TODO: 'Fix broken register, post to firestore, and email verification issues'

  //#TODO: 'Logout user after they complete quiz'
