import { SharedVarService } from './../shared-var.service';
import { AuthenticationService } from './services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoginErrorDialogComponent } from '../login-error-dialog/login-error-dialog.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getDate } from 'date-fns';
import { Firestore, setDoc, doc, query, getDocs, where } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';

@Component({
  selector: 'app-login-pane',
  templateUrl: './login-pane.component.html',
  styleUrl: './login-pane.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 1, transform: 'translate(-1000px)' })),
      transition('void <=> *', [animate('.2s')]),
    ]),
    trigger('invert', [
      state(
        'void',
        style({ backgroundColor: 'white', transform: 'translate(1000px)' })
      ),
      transition('void <=> *', [animate('.2s')]),
    ]),
  ],
})
export class LoginPaneComponent implements OnInit {
  form!: FormGroup;
  isLoggingIn = false;
  userLearnerType = '';
  alertTitle = '';
  hide = true;
  alertMessage = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private logInAuth: AngularFireAuth,
    private sharedVarService: SharedVarService,
    private afs: AngularFirestore,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  openDialog(title: string, msg: string) {
    this.dialog.open(LoginErrorDialogComponent, {
      data: { dialogTitle: title, dialogText: msg },
    });
  }

  async logIn() {
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.sharedVarService.setLoading(true);
    await this.logInAuth.setPersistence('session');
    return new Promise<void>((resolve, reject) => {
      this.logInAuth
        .signInWithEmailAndPassword(email, password)
        .then(async (authUser) => {
          if (authUser.user?.emailVerified) {
            this.sharedVarService.setUserUID(authUser.user?.uid);
            //const collectionPath =;
            const streakDoc = doc(this.firestore, "users", this.sharedVarService.getUserUID());
            // Query existing records for the user, ordered by timestamp
            const userRef = query(collection(this.firestore, "users"), where("__name__", "==", this.sharedVarService.getUserUID()));
            const userSnapshot = await getDocs(userRef);
            userSnapshot.forEach(doc => {
              const userData = doc.data();
                    this.userLearnerType = userData['learnerType'];
                    this.sharedVarService.setLearnerType(this.userLearnerType);
                    this.sharedVarService.setTotalSessions(userData['totalSessions']);
                    this.sharedVarService.totalSessions++;
                    const date = new Date();
                    const currentDate =date.getDate() + '-' + date.getMonth() +  '-' + date.getFullYear();

                    var currentStreak = 0;
                    var longestStreak = 0;

                    if (userData['lastLogInDate'] != currentDate) {
                      switch (userData['lastLogInDate']) {
                        case 'undefined':
                          currentStreak = 1;
                          longestStreak = 1;
                          break;

                        case date.getDate() -
                          1 +
                          '-' +
                          date.getMonth() +
                          '-' +
                          date.getFullYear():
                          currentStreak = userData['currentStreak'];
                          currentStreak++;
                          longestStreak = userData['longestStreak'];

                          if (currentStreak > longestStreak) {
                            longestStreak = currentStreak;
                          }

                          break;

                        default:
                          currentStreak = 1;
                          longestStreak = 1;
                          break;
                      }
                      const streakData = {
                        lastLogInDate: currentDate,
                        currentStreak: currentStreak,
                        longestStreak: longestStreak,
                        totalSessions: this.sharedVarService.totalSessions,
                      };
                      console.log('Total ');
                      console.log( 'yesterday: ' +(date.getDate() - 1) + '-' + date.getMonth() + '-' +date.getFullYear());
                      console.log(currentDate +'\n' +currentStreak +'\n' +longestStreak);

                      this.sharedVarService.setCurrentStreak(currentStreak);
                      this.sharedVarService.setLongestStreak(longestStreak);
                      console.log(currentStreak);
                      setDoc(streakDoc,streakData,{ merge: true });
                    } else {
                      this.sharedVarService.setCurrentStreak(
                        userData['currentStreak']
                      );
                      this.sharedVarService.setLongestStreak(
                        userData['longestStreak']
                      );
                    }

                    this.sharedVarService.setCompletedQuizCnt(userData['completedQuizzes'] );

                    if (this.userLearnerType != 'undefined') {
                      this.router.navigate(['dashboard']);
                    } else {
                      this.router.navigate(['quiz']);
                    }
                    this.sharedVarService.setLoading(false);
                    resolve();

                  console.log(this.sharedVarService.getLearnerType());
                });
          }else {
            throw 'auth/not-verified';
            this.sharedVarService.setLoading(false);
            reject();
          }
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/invalid-credential': {
              this.alertTitle = 'Invalid Credentials';
              this.alertMessage =
                'Verify your email and password and try again.';
              break;
            }

            default: {
              if (error == 'auth/not-verified') {
                this.alertTitle = 'Not Verified';
                this.alertMessage =
                  'Please verify your email address before logging in.';
              } else {
                this.alertTitle = 'Unexpected Error';
                this.alertMessage = 'Please try again.';
                console.log(error);
              }
              break;
            }
          }
          this.isLoggingIn = false;
          this.openDialog(this.alertTitle, this.alertMessage);
          this.sharedVarService.setLoading(false);
          reject();
        });
    });
  }

  toRegister() {
    if (true) {
      this.router.navigate(['register']);
    }
  }
}

