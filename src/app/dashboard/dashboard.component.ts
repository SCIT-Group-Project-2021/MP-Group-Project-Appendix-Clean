import { SharedVarService } from './../shared-var.service';
import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getStorage, ref, getDownloadURL } from '@angular/fire/storage'
import { Firestore, setDoc, doc, query, collection, getDocs } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CalendarEvent } from 'angular-calendar';
import { Router } from '@angular/router';

interface ButtonStates {
  addButton: string;
  notifButton: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({opacity: 0, transform: 'scale(0.9)'})) ,
      transition('void <=> *',[
        animate('.2s')
      ])
    ])
  ]
})
export class DashboardComponent {

  streakDays: string = '0';
  longestStreakDays: string = '0';
  totalSessions: number = 0
  completedTopics: number = 0
  completedQuizCnt: string = '0'
  options: any;
  events: CalendarEvent[] = [{
    start: new Date('2024-05-06, 23:59:59'),
    end: new Date('2024-05-06, , 24:59:59'),
    title: "Final Test",
    draggable: true,
    resizable: {
      beforeStart: true,
      afterEnd: true,
    },
    color: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    }
  }];
  constructor(private auth : AngularFireAuth,private router: Router, private sharedVarService : SharedVarService, private firestore : Firestore, private afs: AngularFirestore){
    this.auth.authState.subscribe((data) => {

    })
  }
  //TODO: Add upcoming events to dashboard
  async ngOnInit() {
    console.log("NgonInit Check")
    this.auth.authState.subscribe(async (user) => {
      if (user) {
        console.log("NgonInit Check2")
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.streakDays = String(this.sharedVarService.getCurrentStreak());
        this.longestStreakDays =  String(this.sharedVarService.getLongestStreak());
        this.completedQuizCnt = String(this.sharedVarService.getcompletedQuizCnt());
        this.totalSessions = this.sharedVarService.getTotalSessions();
        await this.getCompletedTopicsNum();
        setDoc(doc(this.firestore, "users", (this.sharedVarService.getUserUID()).toString()), {totalSessions : this.totalSessions}, {merge: true});
      } else {
          // User is not logged in, redirect to login page
          this.router.navigate(['']);
      }
    });

  }

  goToTab(goal: string) {
    console.log("We went to " + goal + " tab");
    this.router.navigate([goal])
  }

  async getCompletedTopicsNum() {
    var topicCount : number = 0
    const collectionPath = `users/${this.sharedVarService.getUserUID()}/courses/college-math/topicsCompleted/`

    // Query collection to get all records
    const q = query(collection(this.firestore, collectionPath));

    await getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // Sum up the grades
        topicCount++;
      });

      this.completedTopics = topicCount

      console.log("Average grade:", topicCount);
    }).catch(error => {
      console.error("Error calculating average grade: ", error);
    });
  }
  /*getCompletedTopicsNum(){
    var topicCount : number = 0
    console.log(topicCount)
    return new Promise<void>((resolve, reject) => {
      if(this.sharedVarService.getCompletedTopicsArray().length == 0){
        console.log("Fetching...");
        this.afs.collection(`users/${this.sharedVarService.getUserUID()}/courses/college-math/topicsCompleted/`).snapshotChanges().subscribe((res) => {
          res.map((e: any) => {
              topicCount++;
              console.log("In res: " +topicCount)
          });
          this.completedTopics = topicCount
          resolve();
        },
        (err) => {
          console.error('Error while fetching data:', err);
          reject(err);
        });
      } else {
        resolve();
      }
    });
  }*/
  dataCircle = {
    labels: ['Series', 'Summation Notion', 'Arithmetic and Geometric'],
    datasets: [
        {
            label: 'Courses',
            data: [33, 33, 33]
        }
    ]
  };



}
