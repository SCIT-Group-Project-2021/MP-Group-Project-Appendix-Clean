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
import { Firestore, setDoc, doc, collection, addDoc } from '@angular/fire/firestore';
import { deleteDoc } from 'firebase/firestore';


@Component({
  selector: 'app-missed-questions-pane',
  templateUrl: './missed-questions-pane.component.html',
  styleUrl: './missed-questions-pane.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({opacity: 0, transform: 'scale(0.9)'})) ,
      transition('void <=> *',[
        animate('.2s')
      ])
    ])
  ]
})
export class MissedQuestionsPaneComponent {

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

  async nextQuestionTest(){
    this.sharedVarService.setLoading(true);
    this.sharedVarService.setUsedChat(false);
    if (this.cnt < this.testQuestionArray.length) {
      console.log("Count:  " + this.cnt + "\nLength: " + this.testQuestionArray.length)
      if(this.cnt < 1 || this.clickedButton != undefined){
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach((button: Element) => {
          const buttonElement = button as HTMLButtonElement;
          buttonElement.disabled = false;
          buttonElement.style.backgroundColor = this.btnBackgroundColour;
          buttonElement.style.setProperty('border-color', this.btnOutline, 'important')
          buttonElement.style.setProperty('color', this.btnOutline, 'important')
        });
        
        //this.equation = this.questionsArray[this.cnt].eq;
        this.sharedVarService.setQuestionString(this.testQuestionArray[this.cnt])
        this.multipleChoiceArray = await this.geminiService.generateMSA(`You will be asked a question. Your reply should only include the multiple choice answers with quotation marks per answer without square brackets Example question: Give me 3 other multiple choice answers using katex formatting similar to this "T_n = n^2".answer} can accept Example response: "T_n = n + 1", "T_n = \sqrt{n}", "T_n = -n * n" Question: Give me 3 other multiple choice answers using katex formatting similar to this "${this.testAnswerArray[this.cnt]}" can accept`);
        
        this.multipleChoiceArray.push(this.testAnswerArray[this.cnt]);
        this.shuffleMSA(this.multipleChoiceArray);
        //this.option1 = this.questionsArray[this.cnt].answer;
        this.q1 = this.testQuestionArray[this.cnt];
        this.clickedButton = undefined;
        this.cnt++;
        this.sharedVarService.setLoading(false);
        console.log("Length of: " + this.testQuestionArray.length)
        console.log("Count:  " + this.cnt)
      }
      else{
        this.sharedVarService.setLoading(false);
        this.snackBar.open("Please select an answer", 'Close',{
          duration: 1500
        });
      }

    }
    else{
      console.log("Count in else:  " + this.cnt)
      this.sharedVarService.setLoading(false);
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
    this.afs.collection(`users/${this.sharedVarService.getUserUID()}/courses/college-math/missed-questions/`, ref => ref.where('question', '==', this.testQuestionArray[this.cnt-1].toString()).limit(1)).get().toPromise().then(querySnapshot => {
      console.log("Doc outside: " + querySnapshot)
      querySnapshot?.forEach(doc => {
        console.log("Doc: " + doc)
        // Delete each document
        this.afs.collection(`users/${this.sharedVarService.getUserUID()}/courses/college-math/missed-questions/`).doc(doc.id).delete().then(() => {
          console.log("Document successfully deleted!");
        }).catch(error => {
          console.error("Error removing document: ", error);
        });
      });
    })
    this.snackBar.open("The question has been removed from your missed questions", 'Close',{
      duration: 4000
    });
    this.currentIndex++;


    this.nextQuestionTest();
  }

  endSession(){
    this.router.navigate(['/review']);
  }

  loadResults() {
    this.showResults = true;
    //TODO: implement finalize results
  }

  checkQuestion(clickedId: string){
    this.clickedButton = document.getElementById(clickedId) as HTMLButtonElement;
    var buttonValue = this.clickedButton?.getAttribute('value') as string;
    var answer = this.testAnswerArray[this.cnt-1].toString();
    console.log("Answer: "+ answer)
    console.log("Button value: "+ buttonValue)
    //if(clickedButton?.getAttribute('value')?.toString().trim() == this.questionsArray[this.cnt].answer.toString().trim()){
    if(buttonValue == answer){
      this.correctQuestions++;
      if(this.sharedVarService.getUsedChat() != true){
        this.afs.collection(`users/${this.sharedVarService.getUserUID()}/courses/college-math/missed-questions/`, ref => ref.where('question', '==', this.testQuestionArray[this.cnt-1].toString()).limit(1)).get().toPromise().then(querySnapshot => {
          querySnapshot?.forEach(doc => {
            console.log("Doc: " + doc)
            // Delete each document
            this.afs.collection(`users/${this.sharedVarService.getUserUID()}/courses/college-math/missed-questions/`).doc(doc.id).delete().then(() => {
              console.log("Document successfully deleted!");
            }).catch(error => {
              console.error("Error removing document: ", error);
            });
          });
        })
      }
      this.clickedButton.style.backgroundColor = "#49beb7"
      this.clickedButton.style.setProperty('border-color', '#49beb7', 'important')
      this.clickedButton.style.setProperty('color', '#FFFFFF', 'important')
      this.sharedVarService.totalCorrectQuestions++;
      console.log("Total correct question: " + this.sharedVarService.getTotalCorrectQuestions())
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach((button: Element) => {
        const buttonElement = button as HTMLButtonElement;
        buttonElement.disabled = true;
      });
    }
    else{
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

  testComplete() {
    //TODO: implement finalize results
    //TODO: Store in database and add avg result to course page
    this.sharedVarService.completedQuizCnt++;
    //const updateCorrectQ = collection(this.firestore,`users/${this.sharedVarService.getUserUID()}/courses/college-math/`);
    //setDoc(doc(updateCorrectQ), {correctQ: this.sharedVarService.getTotalCorrectQuestions()}, {merge: true});
    setDoc(doc(this.firestore, "users", (this.sharedVarService.getUserUID()).toString()), {completedQuizzes: this.sharedVarService.getcompletedQuizCnt()}, {merge: true});
    this.router.navigate(['/review']);

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
