import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  AngularFirestore
} from '@angular/fire/compat/firestore';
import { SharedVarService } from '../shared-var.service';
import { CountdownEvent } from 'ngx-countdown';
import { GeminiService } from '../gemini.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Firestore, setDoc, doc, collection, addDoc, getDocs, query, orderBy, deleteDoc } from '@angular/fire/firestore';

export interface Questions {
  prt1: string;
  prt2: string;
  eq: string;
  answer: string;
}

@Component({
  selector: 'app-quiz-pane',
  templateUrl: './quiz-pane.component.html',
  styleUrl: './quiz-pane.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({opacity: 0, transform: 'scale(0.9)'})) ,
      transition('void <=> *',[
        animate('.2s')
      ])
    ])
  ]
})
export class QuizPaneComponent {




  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private sharedVarService: SharedVarService,
    private snackBar: MatSnackBar,
    private firestore : Firestore){}

  geminiService: GeminiService = inject(GeminiService);
  testQuestionArray : string[] = []
  testAnswerArray : string[] = []
  multipleChoiceArray : string[] = []
  questionsArray: Questions[] = [];
  clickedButton: HTMLButtonElement | undefined;
  currentIndex = 0;
  totalQuestions = 0;
  correctQuestions = 0;
  btnOutline = "#172156"
  btnBackgroundColour = "#f4f7fe"
  equation = "";
  option1 = 'option 1';
  option2 = 'option 2';
  option3 = 'option 3';
  option4 = 'option 4';
  p2Bool : boolean = true;
  equationCheck : boolean = true;
  showResults: boolean = false;

  q1 : string = "";
  q2: string =  "";
  cnt = 0;
  topic = this.sharedVarService.getTopic();
  multipleChoice = this.sharedVarService.getMultipleChoice();
  timer = this.sharedVarService.getTimer();
  timeLeft = this.sharedVarService.getTimerValue() * 60;

  timerConfig = {
    leftTime: this.timeLeft,
    notify: [this.timeLeft/4]
  }
  notify = '';

  timerEvent(e: CountdownEvent) {
    this.notify = e.action.toUpperCase();
    if (e.action === 'notify') {
      const timerElement = document.getElementById('timer');
      if (timerElement) {
        timerElement.style.color = 'red';
      }
      this.notify += ` - ${e.left} ms`;
    }
    console.log('Notify', e);

    if (e.action === 'done') {
      console.log('event handled');
      this.loadResults();
    }
  }

  async ngOnInit() {
    //await this.getQuestions();
    this.testQuestionArray = this.sharedVarService.getQuestionsArray();
    this.testAnswerArray = this.sharedVarService.getAnswersArray();
    this.totalQuestions = this.testQuestionArray.length;
    console.log("test length: " + this.testQuestionArray.length)
    this.nextQuestionTest()
  }

  getQuestions() {
    return new Promise<void>((resolve) => {
    this.afs.collection('/courses/college-math/topics/' + this.sharedVarService.getTopic() + '/questions').snapshotChanges().subscribe((questions) => {
        questions.map((e: any) => {
          var ques1 = '';
          var ques2 = '';
          var eqt = '';
          var answer = '';

          //this.p1 = e.payload.doc.data().step1;
          ques1 = e.payload.doc.data().step1;
          eqt = e.payload.doc.data().equation;
          answer = e.payload.doc.data().answer;


          if (e.payload.doc.data().step1_2 != null) {
            //this.notes.push(e.payload.doc.data().step1_2);
            ques2 = e.payload.doc.data().step1_2;
            this.p2Bool = false;
          } else {
            this.p2Bool = true;
          }

          this.questionsArray.push({
            prt1: ques1,
            prt2: ques2,
            eq: eqt,
            answer: answer,
          });


        });
        this.nextQuestion();
        this.totalQuestions = this.questionsArray.length;
      });
      resolve();
    })
  }

  async nextQuestionTest(){
    this.sharedVarService.setLoading(true);
    this.sharedVarService.setUsedChat(false);
    if (this.cnt < this.testQuestionArray.length) {
      if(this.cnt < 1 || this.clickedButton != undefined){
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach((button: Element) => {
          const buttonElement = button as HTMLButtonElement;
          buttonElement.disabled = false;
          buttonElement.style.backgroundColor = this.btnBackgroundColour;
          buttonElement.style.setProperty('border-color', this.btnOutline, 'important')
          buttonElement.style.setProperty('color', this.btnOutline, 'important')
        });
        console.log("Question array: " + this.testQuestionArray[this.cnt])
        console.log("Answer array: " +this.testAnswerArray[this.cnt])


        //this.equation = this.questionsArray[this.cnt].eq;
        this.sharedVarService.setQuestionString(this.testQuestionArray[this.cnt])
        this.multipleChoiceArray = await this.geminiService.generateMSA(`You will be asked a question. Your reply should only include the multiple choice answers with quotation marks per answer without square brackets Example question: Give me 3 other multiple choice answers using katex formatting similar to this "T_n = n^2".answer} can accept Example response: "T_n = n + 1", "T_n = \sqrt{n}", "T_n = -n * n" Question: Give me 3 other multiple choice answers using katex formatting similar to this "${this.testAnswerArray[this.cnt]}" can accept`);
        this.multipleChoiceArray.push(this.testAnswerArray[this.cnt]);
        this.shuffleMSA(this.multipleChoiceArray);
        this.q1 = this.testQuestionArray[this.cnt];
        //this.option1 = this.questionsArray[this.cnt].answer;
        this.clickedButton = undefined;
        this.cnt++;
        console.log("Length of: " + this.testQuestionArray.length)
        console.log("Count:  " + this.cnt)
        this.sharedVarService.setLoading(false);
      }
      else{
        this.sharedVarService.setLoading(false);
        this.snackBar.open("Please select an answer", 'Close',{
          duration: 1500
        });
      }

    }
    else{
      this.sharedVarService.setLoading(false);
      console.log("Count in else:  " + this.cnt)
      this.loadResults();
    }
  }

  reportQuestion(){
    this.clickedButton = document.getElementById('report') as HTMLButtonElement;
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach((button: Element) => {
      const buttonElement = button as HTMLButtonElement;
      buttonElement.disabled = false;
    });
    this.snackBar.open("If this issue continues, please click the restart button to return to the review page", 'Close',{
      duration: 4000
    });
    this.totalQuestions--;

    this.nextQuestionTest();
  }

  endSession(){
    this.router.navigate(['/review']);
  }

  checkQuestion(clickedId: string){
    this.clickedButton = document.getElementById(clickedId) as HTMLButtonElement;
    var buttonValue = this.clickedButton?.getAttribute('value') as string;
    var answer = this.testAnswerArray[this.cnt-1].toString();
    console.log("Answer: "+ answer)
    console.log("Button value: "+ buttonValue)
    //if(clickedButton?.getAttribute('value')?.toString().trim() == this.questionsArray[this.cnt].answer.toString().trim()){
    if(buttonValue == answer){
      if(this.sharedVarService.getUsedChat() == true){
        const userData = {
          question: this.testQuestionArray[this.cnt-1].toString(),
          answer: answer
        }
        const updateMissedQuestions = collection(this.firestore, `users/${this.sharedVarService.getUserUID()}/courses/college-math/missed-questions/`);
        addDoc(updateMissedQuestions, userData)
      }
      this.clickedButton.style.backgroundColor = "#49beb7"
      this.clickedButton.style.setProperty('border-color', '#49beb7', 'important')
      this.clickedButton.style.setProperty('color', '#FFFFFF', 'important')
      this.sharedVarService.totalCorrectQuestions++;
      this.correctQuestions++;
      console.log("Total correct question: " + this.sharedVarService.getTotalCorrectQuestions())
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach((button: Element) => {
        const buttonElement = button as HTMLButtonElement;
        buttonElement.disabled = true;
      });
    }

    else{
      const userData = {
        question: this.testQuestionArray[this.cnt-1].toString(),
        answer: answer
      }
      const updateMissedQuestions = collection(this.firestore, `users/${this.sharedVarService.getUserUID()}/courses/college-math/missed-questions/`);
      addDoc(updateMissedQuestions, userData)
      this.clickedButton!.style.backgroundColor = "#E95B5B"
      this.clickedButton.style.setProperty('border-color', '#E95B5B', 'important')
      this.clickedButton.style.setProperty('color', '#FFFFFF', 'important')

      const buttons = document.querySelectorAll('.btn');
      buttons.forEach((button: Element) => {
        const buttonElement = button as HTMLButtonElement;
        const buttonValue = buttonElement.getAttribute('value');
        buttonElement.disabled = true;
        if (buttonValue === answer) {
            buttonElement.style.backgroundColor = "#49beb7";
            buttonElement.style.setProperty('border-color', '#49beb7', 'important')
            buttonElement.style.setProperty('color', '#FFFFFF', 'important')
            return;
        }
      });
    }

    this.currentIndex++;
  }

  nextQuestion() {
    this.currentIndex++;
    console.log("iN NEXT QUESTION")
      if (this.cnt < this.questionsArray.length) {
        console.log(this.questionsArray[this.cnt].prt1)
        this.q1 = this.questionsArray[this.cnt].prt1;
        this.q2 = this.questionsArray[this.cnt].prt2;
        this.equation = this.questionsArray[this.cnt].eq;
        this.option1 = this.questionsArray[this.cnt].answer;
        if (this.equation == '') {
          this.equationCheck = true;
        } else {
          this.equationCheck = false;
        }

        if (this.q2 == '') {
          this.p2Bool = true;
        } else {
          this.p2Bool = false;
        }

        this.cnt++;
        console.log("Count: " + this.cnt);
        console.log("length: " +  this.questionsArray.length);

    }else{
      this.loadResults();
    }
  }

  loadResults() {
    this.showResults = true;
  }

  testComplete() {
    this.sharedVarService.completedQuizCnt++;
    //const updateCorrectQ = collection(this.firestore,`users/${this.sharedVarService.getUserUID()}/courses/college-math/`);
    //setDoc(doc(updateCorrectQ), {correctQ: this.sharedVarService.getTotalCorrectQuestions()}, {merge: true});
    const createCourseData = doc(this.firestore, `users/${(this.sharedVarService.getUserUID()).toString()}/courses/college-math`);
    setDoc(createCourseData, {correctQ: this.sharedVarService.getTotalCorrectQuestions()}, {merge: true});
    this.pushGradeToDatabase();
    setDoc(doc(this.firestore, "users", (this.sharedVarService.getUserUID()).toString()), {completedQuizzes: this.sharedVarService.getcompletedQuizCnt()}, {merge: true});
    this.router.navigate(['/review']);
  }

  async pushGradeToDatabase(){
    const grade = Math.round((this.correctQuestions / this.totalQuestions) * 100);
    const collectionPath = `users/${this.sharedVarService.getUserUID()}/courses/college-math/grades/`;

    // Query existing records for the user, ordered by timestamp
    const q = query(collection(this.firestore, collectionPath), orderBy('timestamp', 'desc'));

    // Get existing records
    getDocs(q).then(querySnapshot => {
      // Check if the number of records exceeds 10
      if (querySnapshot.size >= 10) {
        // Delete the oldest records
        const recordsToDelete = querySnapshot.docs.slice(9); // Keep only the first 10 records
        recordsToDelete.forEach(record => {
          deleteDoc(doc(this.firestore, collectionPath, record.id)).then(() => {
            console.log("Document successfully deleted!");
          }).catch(error => {
            console.error("Error deleting document: ", error);
          });
        });
      }
    }).then(() => {
      // Add the new record
      const newRecordData = {
        // Your new record data
        timestamp: new Date(), // Assuming you have a timestamp field
        grade: grade
        // Add other fields as needed
      };
      addDoc(collection(this.firestore, collectionPath), newRecordData).then(() => {
        console.log("New record added successfully!");
      }).catch(error => {
        console.error("Error adding new record: ", error);
      });
    }).catch(error => {
      console.error("Error getting existing records: ", error);
    });

    this.sharedVarService.setFeedback(await this.geminiService.generateFeedback(`I got ${grade} on a test covering these topics: ${this.sharedVarService.getCompletedTopics()}. My learner type is a ${this.sharedVarService.getLearnerType()} from the Honey and Mumford's learning style theory. This software includes an AI tutor to help with answering questions, course content to review and quizes to test knowledge. You can reccommend these features to be used. Can you give me feedback on what I should do next to improve in 3 sentences? Please phrase your feedback like an encouraging tutor. `));
  }

  shuffleMSA(array: string[]){
    // Make a copy of the original array to avoid modifying it
    const shuffledArray = array.slice();

    // Fisher-Yates shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    this.option1 = shuffledArray[0];
    this.option2 = shuffledArray[1];
    this.option3 = shuffledArray[2];
    this.option4 = shuffledArray[3];

  }

}
