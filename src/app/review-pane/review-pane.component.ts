import { Component, inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { SharedVarService } from '../shared-var.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getDocs, query, Firestore, orderBy, limit } from '@angular/fire/firestore';
import { first } from 'rxjs';
import { GeminiService } from '../gemini.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-review-pane',
  templateUrl: './review-pane.component.html',
  styleUrl: './review-pane.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({opacity: 0, transform: 'scale(0.9)'})) ,
      transition('void <=> *',[
        animate('.2s')
      ])
    ])
  ]
})
export class ReviewPaneComponent {
  geminiService: GeminiService = inject(GeminiService);
  quizAvailable: boolean = false
  quizSettings: boolean = false
  multipleChoice: boolean = true
  timer: boolean = false
  hints: boolean = false
  timerValue: number = 5;
  selectedTopicNames: string = ""
  questionCount: number = 10
  missedQ: number = 0;
  lastGrade: number = 0;
  topicsFormControl: FormControl<any> = new FormControl('');
  selectedValue : string ='';
  topicList: string[] = [];

  constructor(
    private router: Router,
    private sharedVarService: SharedVarService,
    private snackBar: MatSnackBar,
    private firestore : Firestore,
    private afs: AngularFirestore){}

  async ngOnInit() {
    await this.loadData();
    this.setTopicValue();
    console.log("Completed Topics: " + this.sharedVarService.getCompletedTopicsArray())
    console.log("Completed Topics Length: " + this.sharedVarService.getCompletedTopicsArray().length)
    if(this.sharedVarService.getCompletedTopicsArray().length == 0){
      this.snackBar.open("Please complete course content to unlock reviews!", 'Close',{
        duration: 3000
      });
    }
    else{
      this.quizAvailable = true
      this.sharedVarService.setQuestionsArray([])
      this.sharedVarService.setAnswersArray([])
      await this.getTotalMissedQuestions()
      await this.getLastGrade();
      console.log("Quiz value: " + this.quizAvailable)
    }
  }

  changeClient(data: string){
    this.selectedTopicNames = data;
    console.log(this.selectedTopicNames);
  }
  loadData() {
    this.sharedVarService.setCompletedTopicsArray([]);
    this.topicList = [];
    return new Promise<void>((resolve, reject) => {
      if(this.sharedVarService.getCompletedTopicsArray().length == 0){
        console.log("Fetching...");
        this.afs.collection(`users/${this.sharedVarService.getUserUID()}/courses/college-math/topicsCompleted/`).snapshotChanges().subscribe((res) => {
          res.map((e: any) => {
              this.sharedVarService.getCompletedTopicsArray().push(e.payload.doc.data().name);
              this.topicList.push(e.payload.doc.data().name)
              console.log("Topic value: " +e.payload.doc.data().name + "\nArray value: " + this.sharedVarService.getCompletedTopicsArray());
          });

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
  }

  setTopicValue(){
    for (let index = 0; index < this.topicList.length; index++) {
      switch(this.topicList[index]){
        case 'topic1':
          this.topicList[index] = "Series";
          break;
        case 'topic2':
          this.topicList[index] = "Summation Notation";
          break;

        case 'topic3':
          this.topicList[index] = "Arithmetic and Geometric Series";
          break;
      }
    }


  }
  getTotalMissedQuestions() {
    let totalGrade = 0;
    let totalRecords = 0;
    const collectionPath = `users/${this.sharedVarService.getUserUID()}/courses/college-math/missed-questions/`

    // Query collection to get all records
    const q = query(collection(this.firestore, collectionPath));

    getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        totalRecords++;
      });

      this.missedQ = totalRecords;


    }).catch(error => {
      console.error("Error calculating average grade: ", error);
    });
  }

  getLastGrade() {
    const collectionPath = `users/${this.sharedVarService.getUserUID()}/courses/college-math/grades/`
    // Query collection to get last uploaded record
    const q = query(collection(this.firestore, collectionPath), orderBy('timestamp', 'desc'), limit(1));

    getDocs(q).then(querySnapshot => {
      if (querySnapshot.empty) {
        this.lastGrade = 0
        return;
      }
      querySnapshot.forEach(doc => {
        // Get the grade of the last uploaded record
        const lastUploadedGrade = doc.data()['grade'];
        this.lastGrade = lastUploadedGrade
      });
    }).catch(error => {
      console.error("Error getting last uploaded grade: ", error);
    });
  }

  goToTab(goal: string, text: string,$value: string) {
    console.log("We went to " + goal);
    this.router.navigate([goal])
  }

  async missedQuiz() {
    /*this.sharedVarService.setTimer(false)
    this.sharedVarService.setMultipleChoice(true)
    this.sharedVarService.setLoading(true);
    console.log("Clicked!")
    const questionArray: string[] = [];
    const answerArray: string[] = [];
    return new Promise<void>((resolve, reject) =>{
      this.afs.collection(`users/${this.sharedVarService.getUserUID()}/courses/college-math/missed-questions/`).snapshotChanges().subscribe((questions) => {
        questions.map((e: any) => {
          console.log("Any output?: " + e.payload.doc.data().question)
          console.log("Answer output?: " + e.payload.doc.data().answer)
          var ques = '';
          var answer = '';

          questionArray.push(e.payload.doc.data().question)
          answerArray.push(e.payload.doc.data().answer)
          console.log("Questions Array: " + questionArray)
          console.log("Answer Array: " + answerArray)

        });
        this.sharedVarService.setQuestionsArray(questionArray);
        this.sharedVarService.setAnswersArray(answerArray);
        this.goToTab('missed-questions-pane', 'Missed Quiz', 'missed');
        this.sharedVarService.setLoading(false);
        resolve();
      });
    })*/
    this.sharedVarService.setTimer(false);
    this.sharedVarService.setMultipleChoice(true);
    this.sharedVarService.setLoading(true);
    console.log("Clicked!");

    const questionArray: string[] = [];
    const answerArray: string[] = [];
    try {
      const collectionPath = `users/${this.sharedVarService.getUserUID()}/courses/college-math/missed-questions/`;
      const querySnapshot = await getDocs(query(collection(this.firestore, collectionPath)));

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Any output?: " + data['question']);
        console.log("Answer output?: " + data['answer']);

        questionArray.push(data['question']);
        answerArray.push(data['answer']);
      });

      this.sharedVarService.setQuestionsArray(questionArray);
      this.sharedVarService.setAnswersArray(answerArray);
      this.goToTab('missed-questions-pane', 'Missed Quiz', 'missed');
      this.sharedVarService.setLoading(false);
    } catch (error) {
      console.error("Error fetching missed questions:", error);
      // Handle error, reject promise, show error message, etc.
    }
  }

  async quickQuiz() {
    this.sharedVarService.setLoading(true);
    this.sharedVarService.setTimer(false)
    this.sharedVarService.setTopic(this.sharedVarService.getCompletedTopicsArray()[0].toString()) // Convert topicNames to string
    this.sharedVarService.setMultipleChoice(true)
    return new Promise<void>(async (resolve, reject) => {
      console.log("Fetching...");
      this.afs.collection(`users/${this.sharedVarService.getUserUID()}/courses/college-math/topicsCompleted/`).snapshotChanges().subscribe((res) => {
        res.map((e: any) => {
            this.sharedVarService.getCompletedTopicsArray().push(e.payload.doc.data().name);
        });

      },
      (err) => {
        console.error('Error while fetching data:', err);
        reject(err);
      });
      console.log("Topic List: " +this.sharedVarService.getCompletedTopicsArray())
      var topicNames = ""
      await this.afs.collection(`/courses/college-math/topics/`, ref => ref.where('__name__', 'in', this.sharedVarService.getCompletedTopicsArray())).snapshotChanges().subscribe(async res =>{
        res.map((e: any) => {
          console.log("Any output?: " + e.payload.doc.data().name)
          if(topicNames == ""){
            topicNames = topicNames + e.payload.doc.data().name;
          }
          else{
            topicNames = topicNames + ", " + e.payload.doc.data().name;
          }

        })
        console.log("Topic Names: " + topicNames)
        // TODO: Make waiting animation
        const mcqArray = await this.geminiService.generateMSQ(`You will be asked a question. Your reply should only include the math questions with the answers with quotation marks and separated my commas without square brackets or new lines. Example question: Give me 2 questions for series and sequences with their answers Example response: "If the general term of a sequence is T_n = 2^n , what are the first three terms?", "2, 4, 8", "Determine the 4th and 5th term of the sequence with the general term T_n=(-1)^n", "what is the general term for this sequence 9, 6, 3", "T_n = 12 - 3n" Question: Give me 10 questions for ${topicNames} with their answers`)

        const evenIndexArray: string[] = [];
        const oddIndexArray: string[] = [];


        for (let i = 0; i < mcqArray!.length; i++) {
          if (i % 2 === 0) {
              evenIndexArray.push(mcqArray![i]);
          } else {
              oddIndexArray.push(mcqArray![i]);
          }
        }

        this.sharedVarService.setQuestionsArray(evenIndexArray);
        this.sharedVarService.setAnswersArray(oddIndexArray);

        this.goToTab('quiz-pane', 'Quick Quiz', 'quick');
        this.sharedVarService.setLoading(false);
        resolve();
      })


    });

  };


  flashCards() {
    this.sharedVarService.setTimer(false)
    this.sharedVarService.setTopic(this.sharedVarService.getCompletedTopicsArray()[0].toString()) // Convert topicNames to string
    this.sharedVarService.setMultipleChoice(false)
    this.goToTab('quiz-pane', 'Flash Cards', 'flashcards');

  }

  togglequizMenu() {
    this.quizSettings = !this.quizSettings
  }

  quiz() {
    this.quizSettings = true
    return new Promise<void>(async (resolve, reject) => {
      console.log("Fetching...");
      this.afs.collection(`users/${this.sharedVarService.getUserUID()}/courses/college-math/topicsCompleted/`).snapshotChanges().subscribe((res) => {
        res.map((e: any) => {
            this.sharedVarService.getCompletedTopicsArray().push(e.payload.doc.data().name);
        });
      },
      (err) => {
        console.error('Error while fetching data:', err);
        reject(err);
      });
      console.log("Topic List: " +this.sharedVarService.getCompletedTopicsArray())
      var topicNames : string[] = []
      await this.afs.collection(`/courses/college-math/topics/`, ref => ref.where('__name__', 'in', this.sharedVarService.getCompletedTopicsArray())).snapshotChanges().subscribe(async res =>{
        res.map((e: any) => {
          console.log("Any output?: " + e.payload.doc.data().name)
          topicNames.push(e.payload.doc.data().name)
        })
        console.log("Topic Names: " + topicNames)
        resolve();
      })
    });
  }

  quizStart() {
    this.sharedVarService.setLoading(true);
    this.quizSettings = false
    this.sharedVarService.setTimer(this.timer)
    this.sharedVarService.setTimerValue(this.timerValue)
    this.sharedVarService.setTopic(this.sharedVarService.getCompletedTopicsArray()[0].toString()) // Convert topicNames to string
    this.sharedVarService.setMultipleChoice(this.multipleChoice)
    return new Promise<void>(async (resolve, reject) => {
      const mcqArray = await this.geminiService.generateMSQ(`You will be asked a question. Your reply should only include the math questions with the answers with quotation marks and separated my commas without square brackets or new lines. Example question: Give me 2 questions for series and sequences with their answers Example response: "If the general term of a sequence is T_n = 2^n , what are the first three terms?", "2, 4, 8", "Determine the 4th and 5th term of the sequence with the general term T_n=(-1)^n", "what is the general term for this sequence 9, 6, 3", "T_n = 12 - 3n" Question: Give me ${this.sharedVarService.getQuestionCnt()} questions for ${this.selectedTopicNames} with their answers`)

      const evenIndexArray: string[] = [];
      const oddIndexArray: string[] = [];


      for (let i = 0; i < mcqArray!.length; i++) {
        if (i % 2 === 0) {
            evenIndexArray.push(mcqArray![i]);
        } else {
            oddIndexArray.push(mcqArray![i]);
        }
      }

      this.sharedVarService.setQuestionsArray(evenIndexArray);
      this.sharedVarService.setAnswersArray(oddIndexArray);

      this.goToTab('quiz-pane', 'Timed Quiz', 'timed');
      this.sharedVarService.setLoading(false);
      resolve();
    })
  }

  choiceToggle () {
    this.multipleChoice = !this.multipleChoice
    console.log(this.multipleChoice)
  }

  timerToggle () {
    this.timer = !this.timer
    console.log(this.timer)
  }

  generateMSQArrays(dataArray : string[]){
    const evenIndexArray: string[] = [];
    const oddIndexArray: string[] = [];

    for (let i = 0; i < dataArray.length; i++) {
    if (i % 2 === 0) {
        evenIndexArray.push(dataArray[i]);
    } else {
        oddIndexArray.push(dataArray[i]);
    }
}
  }

}
