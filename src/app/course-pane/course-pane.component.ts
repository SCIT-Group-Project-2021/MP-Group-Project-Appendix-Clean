import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { SharedVarService } from '../shared-var.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getDocs, query, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-course-pane',
  templateUrl: './course-pane.component.html',
  styleUrl: './course-pane.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({opacity: 0, transform: 'scale(0.9)'})) ,
      transition('void <=> *',[
        animate('.2s')
      ])
    ])
  ]
})
export class CoursePaneComponent {
  totalQuestions: number = 0
  avgTestScore: number = 0
  dateTillExam: number = 0;
  feedback: string = ''
  constructor(
    private auth : AngularFireAuth,
    private router: Router,
    private afs : AngularFirestore,
    private sharedVarService : SharedVarService,
    private firestore : Firestore){
    this.auth.authState.subscribe((data) => {
      if(data){

      }
    })
  }



  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if(this.sharedVarService.getFeedback()!=''){
      this.feedback = this.sharedVarService.getFeedback()
    }
    else{
      this.feedback = "Do quizzes to get feedback"
    }
    await this.calculateAverageGrade()
    await this.getCorrectQuestions();
    this.totalQuestions = this.sharedVarService.getTotalCorrectQuestions();
    console.log(this.totalQuestions)
    this.dateTillExam = this.daysBetweenDates(new Date(), new Date("2024-05-06, 23:00:00"));

  }

    daysBetweenDates(date1: Date, date2: Date) {
      // Convert both dates to milliseconds
      const oneDay = 1000 * 60 * 60 * 24;
      const firstDate = new Date(date1).getTime();
      const secondDate = new Date(date2).getTime();

      // Calculate the difference in milliseconds
      const differenceMs = Math.abs(firstDate - secondDate);

      // Convert back to days and return
      return Math.floor(differenceMs / oneDay);
  }

  units = [
    {
      Title: "Series and Sequences",
      topics: [
        {
          Title: "Series",
          topicValue: "topic1",
          Descriptor: "A series is the sum of some set of terms of a sequence."
        },
        {
          Title: "Summation Notion",
          topicValue: "topic2",
          Descriptor: "Summation notation (or sigma notation) allows us to write a long sum in a single expression."
        },
        {
          Title: "Arithmetic and Geometric Series",
          topicValue: "topic3",
          Descriptor: "Arithmetic and geometric series model patterns of change in sequences of numbers, aiding in various mathematical calculations"
        }
      ]
    }
  ]

  calculateAverageGrade() {
    let totalGrade = 0;
    let totalRecords = 0;
    const collectionPath = `users/${this.sharedVarService.getUserUID()}/courses/college-math/grades/`

    // Query collection to get all records
    const q = query(collection(this.firestore, collectionPath));

    getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        // Sum up the grades
        totalGrade += doc.data()['grade'];
        totalRecords++;
      });
      if(totalRecords==0){
        this.avgTestScore = 0;
      }
      else{
        const averageGrade = totalGrade / totalRecords;
        this.avgTestScore = Math.round(averageGrade);
      }
      // Calculate average grade

      console.log("Average grade:", this.avgTestScore);
    }).catch(error => {
      console.error("Error calculating average grade: ", error);
    });
  }

  getCorrectQuestions(){
    console.log("Before college math check")
      return new Promise<void>((resolve, reject) => {
        this.afs.collection(`/users/${this.sharedVarService.getUserUID()}/courses/`, ref => ref.where('__name__', '==', 'college-math')).snapshotChanges().subscribe(res => {
              if (res.length === 0) {
                this.sharedVarService.setTotalCorrectQuestions(0);
                resolve();
                return;
          }
          res.map((e: any) => {
            console.log("In college math check: " + e.payload.doc.data().correctQ)
            this.sharedVarService.setTotalCorrectQuestions(e.payload.doc.data().correctQ);
          })
          resolve();
        })
      })
    }

  goToTab(goal: string, text: string,$value: string) {
    console.log("We went to " + goal);
    console.log($value)
    this.sharedVarService.setTopic($value);
    this.router.navigate([goal])
  }


}


