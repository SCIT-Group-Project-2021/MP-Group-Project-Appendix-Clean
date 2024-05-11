import { SharedVarService } from './../shared-var.service';
import { Component, inject } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Router } from '@angular/router';
import {
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { Firestore, setDoc, doc, collection, addDoc, CollectionReference, query, getDocs, orderBy, where } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GeminiService } from '../gemini.service';
export interface Notes {
  para1: string;
  para2: string;
  eq: string;
  link: string;
}
export interface Questions {
  prt1: string;
  prt2: string;
  eq: string;
  answer: string;
}
export interface topicNames {
  topicName: string;
}
export interface Topic { topicName: string }

@Component({
  selector: 'app-topic-pane',
  templateUrl: './topic-pane.component.html',
  styleUrl: './topic-pane.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      transition('void <=> *', [animate('.2s')]),
    ]),
  ],
})
export class TopicPaneComponent {
  geminiService: GeminiService = inject(GeminiService);
  notesArray: Notes[] = [];
  questionsArray: Questions[] = [];
  multipleChoiceArray: string[] = []
  cnt = -1;
  stepperIndex = 0;
  topicCheck : boolean = true;
  completedTopics: Topic[] = [];
  equationCheck = true;
  p2Bool = false;
  storyCheck = false;
  questionSection = false;
  btnOutline = "#172156"
  btnBackgroundColour = "#f4f7fe"
  youtubeLinkCheck = true
  youtubeLink = ""
  iframeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.youtubeLink);
  clickedButton: HTMLButtonElement | undefined;
  completedTopicsArray : topicNames[] =[];
  equation = '';
  header = '';
  p1 = '';
  p2 = '';
  q1 = '';
  q2 = ';';
  option1: string = '0';
  option2: string = '0';
  option3: string = '0';
  option4: string = '0';
  switchFunction() {
    console.log('not undefined');
  }

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private sharedVarService: SharedVarService,
    private firestore : Firestore,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getIntroLearnerTypeNotes();
    this.getExNotes();
    console.log(this.sharedVarService.getTopic())
  }
/*
  getTopicOverview() {
    this.afs.collection('/courses/college-math/topics/' +this.sharedVarService.getTopic() +'/overview').snapshotChanges().subscribe((overview) => {
        overview.map((f: any) => {
          this.p1 = f.payload.doc.data().step1;
          this.header = 'Objectives';
        });
      });
    this.switchFunction = this.nextExplainSection;
  }*/
  async getTopicOverview() {
    const topic = this.sharedVarService.getTopic();
    const topicOverviewRef = collection(this.firestore, `/courses/college-math/topics/${topic}/overview`);
    const q = query(topicOverviewRef);

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        console.log(doc.data()['step1'])
        this.p1 = doc.data()['step1'];
        this.header = 'Objectives';
      });
    } catch (error) {
      console.error('Error fetching topic overview:', error);
    }
    this.switchFunction = this.nextExplainSection;
  }

  /*getIntroLearnerTypeNotes() {
    this.afs
      .collection(
        '/courses/college-math/topics/' + this.sharedVarService.getTopic() + '/learner-type/' +
          this.sharedVarService.getLearnerType() +
          '/intro'
      )
      .snapshotChanges()
      .subscribe(
        (res) => {
          res.map((e: any) => {
            if (e.payload.doc.data().story != null) {
              this.p1 = e.payload.doc.data().story;

              this.switchFunction = this.getTopicOverview;
            } else {
              this.getTopicOverview();
            }
          });
        },
        (err) => {
          alert('Error while fetching learner type data');
        }
      );
  }*/
  async getIntroLearnerTypeNotes() {
    const topic = this.sharedVarService.getTopic();
    const learnerType = this.sharedVarService.getLearnerType();
    const introRef = collection(this.firestore, `/courses/college-math/topics/${topic}/learner-type/${learnerType}/intro`);
    const q = query(introRef);

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data['story'] != null) {
          this.p1 = data['story'];
          this.switchFunction = this.getTopicOverview;
        } else {
          this.getTopicOverview();
        }
      });
    } catch (error) {
      console.error('Error fetching learner type data:', error);
      alert('Error while fetching learner type data');
    }
  }

  /*getExNotes() {
    this.afs.collection('/courses/college-math/topics/' + this.sharedVarService.getTopic() + '/learner-type/' + this.sharedVarService.getLearnerType() +'/explanation', (ref) => ref.orderBy('id')).snapshotChanges().subscribe((res) => {
          var pr1 = '';
          var pr2 = '';
          var eq = '';
          var yotutubeLink = '';
          res.map((e: any) => {
            if(e.payload.doc.data().step1 != undefined){
              pr1 = e.payload.doc.data().step1;

              if (e.payload.doc.data().step2 == null) {
                if (e.payload.doc.data().step1_2 != null) {
                  //this.notes.push(e.payload.doc.data().step1_2);
                  pr2 = e.payload.doc.data().step1_2;
                  eq = e.payload.doc.data().equation;
                }
              } else if (e.payload.doc.data().equation != null) {
                eq = e.payload.doc.data().equation;
              } else {
                pr2 = e.payload.doc.data().step2;
              }
              yotutubeLink = ''
            }
            else{
              pr1 = '';
              pr2 = '';
              eq = '';
              yotutubeLink = e.payload.doc.data().youtubeLink;
            }

            this.notesArray.push({ para1: pr1, para2: pr2, eq: eq, link: yotutubeLink });
          });
          //console.log("Notes array", this.notesArray);
        },
        (err) => {
          alert('Error while fetching learner type data');
        }
      );
  }*/

  async getExNotes() {
    const topic = this.sharedVarService.getTopic();
    const learnerType = this.sharedVarService.getLearnerType();
    const exRef = collection(this.firestore, `/courses/college-math/topics/${topic}/learner-type/${learnerType}/explanation`);
    const q = query(exRef, orderBy('id'));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        const data = doc.data();
        let pr1 = '';
        let pr2 = '';
        let eq = '';
        let youtubeLink = '';

        if (data['step1'] !== undefined) {
          pr1 = data['step1'];

          if (data['step2'] === undefined) {

            if (data['step1_2'] !== undefined) {
              pr2 = data['step1_2'];
              eq = data['equation'];
            }
          } else if (data['equation'] !== "" && data['equation'] !== undefined) {
            eq = data['equation'];
          } else {
            pr2 = data['step2'];

          }
        } else {
          youtubeLink = data['youtubeLink'];
        }

        this.notesArray.push({ para1: pr1, para2: pr2, eq: eq, link: youtubeLink });
      });
    } catch (error) {
      console.error('Error fetching learner type data:', error);
      alert('Error while fetching learner type data');
    }
  }

  nextExplainSection() {
    if (this.stepperIndex == 0) {
      this.stepperIndex++;
    }
    this.storyCheck = true;
    this.cnt++;
    if (this.cnt < this.notesArray.length) {
      this.p1 = this.notesArray[this.cnt].para1;
      console.log("Step 2 data: " + this.notesArray[this.cnt].para2)
      this.p2 = this.notesArray[this.cnt].para2;
      this.equation = this.notesArray[this.cnt].eq;
      this.youtubeLink = this.notesArray[this.cnt].link;
      console.log("youtube link: " + this.youtubeLink )
      if(this.youtubeLink != ''){
        this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.youtubeLink);
        console.log("iframe link: " + this.iframeSrc )
        this.youtubeLinkCheck = false;
      }
      else{
        this.youtubeLinkCheck = true;
      }
      if (this.equation == '') {
        this.equationCheck = true;
      } else {
        this.equationCheck = false;
      }
    } else {
      this.equation = '';
      this.youtubeLinkCheck = false;
      this.youtubeLink = '';
      this.getQuestions();
      this.cnt = -1;
      this.storyCheck = true;
      console.log('story check set to true');
      this.header = "Let's move on to some practice questions!";
      this.p1 = '';
      console.log('p1 value changed');
      this.p2 = '';

      this.switchFunction = this.nextQuestion;
    }
  }
/*
  getQuestions() {
    if (this.stepperIndex == 1) {
      this.stepperIndex++;
    }
    this.afs.collection('/courses/college-math/topics/' +this.sharedVarService.getTopic() +'/questions').snapshotChanges().subscribe((questions) => {
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
      });
  }*/

  async getQuestions() {
    if (this.stepperIndex == 1) {
      this.stepperIndex++;
    }

    const topic = this.sharedVarService.getTopic();
    const questionsRef = collection(this.firestore, `/courses/college-math/topics/${topic}/questions`);

    try {
      const querySnapshot = await getDocs(questionsRef);
      querySnapshot.forEach(doc => {
        const data = doc.data();
        let ques1 = '';
        let ques2 = '';
        let eqt = '';
        let answer = '';

        ques1 = data['step1'];
        eqt = data['equation'];
        answer = data['answer'];

        if (data['step1_2'] != null) {
          ques2 = data['step1_2'];
          this.p2Bool = false;
        } else {
          this.p2Bool = true;
        }

        this.questionsArray.push({ prt1: ques1, prt2: ques2, eq: eqt, answer: answer });
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Handle error here
    }
  }

  async nextQuestion() {
    this.sharedVarService.setLoading(true);
    this.sharedVarService.setUsedChat(false);
    if(this.cnt < 1 || this.clickedButton != undefined){
      if (this.storyCheck == true && this.cnt < this.questionsArray.length) {
        this.storyCheck = false;
        console.log('story check set to false');
        this.cnt++;
      }
      else {
        //this.storyCheck = false;
        if (this.cnt < this.questionsArray.length) {
          this.q1 = this.questionsArray[this.cnt].prt1;
          this.q2 = this.questionsArray[this.cnt].prt2;
          this.equation = this.questionsArray[this.cnt].eq;
          this.sharedVarService.setQuestion(this.q1, this.equation, this.q2)
          this.multipleChoiceArray = await this.geminiService.generateMSA(`You will be asked a question. Your reply should only include the multiple choice answers with quotation marks per answer without square brackets Example question: Give me 3 other multiple choice answers using katex formatting similar to this "T_n = n^2".answer} can accept Example response: "T_n = n + 1", "T_n = \sqrt{n}", "T_n = -n * n" Question: Give me 3 other multiple choice answers using katex formatting similar to this "${this.questionsArray[this.cnt].answer}" can accept`);
          this.multipleChoiceArray.push(this.questionsArray[this.cnt].answer);
          this.shuffleMSA(this.multipleChoiceArray);
          //this.option1 = this.questionsArray[this.cnt].answer;
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
          this.questionSection = true;
          this.cnt++;
          this.clickedButton = undefined;
        }
        else {
          this.questionSection = false;
          this.equationCheck = false;

          this.p2 = '';
          console.log('story check set to true');
         // const updateCorrectQ = collection(this.firestore,`users/${this.sharedVarService.getUserUID()}/courses/college-math/`);
          //setDoc(doc(updateCorrectQ), {correctQ: this.sharedVarService.getTotalCorrectQuestions()}, {merge: true});

          this.p1 = await this.getSummary();

          console.log(this.p1);
          this.storyCheck = false;
          console.log('After summary load check');
          this.switchFunction = this.returnToCoursePage;

        }
      }

      const buttons = document.querySelectorAll('.btn');
      buttons.forEach((button: Element) => {
        const buttonElement = button as HTMLButtonElement;
        buttonElement.disabled = false;
        buttonElement.style.backgroundColor = this.btnBackgroundColour;
        buttonElement.style.setProperty('border-color', this.btnOutline, 'important')
        buttonElement.style.setProperty('color', this.btnOutline, 'important')
      });
    }
    else{
      this.snackBar.open("Please select an answer", 'Close',{
        duration: 1500
      });
    }
    this.sharedVarService.setLoading(false);
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

  checkQuestion(clickedId: string){
    this.clickedButton = document.getElementById(clickedId) as HTMLButtonElement;
    var buttonValue = this.clickedButton?.getAttribute('value') as string ;
    var answer = this.questionsArray[this.cnt-1].answer.toString();
    //if(clickedButton?.getAttribute('value')?.toString().trim() == this.questionsArray[this.cnt].answer.toString().trim()){
    if(buttonValue == answer){
      if(this.sharedVarService.getUsedChat() == true){
        const userData = {
          question: (this.questionsArray[this.cnt-1].prt1 + " " + this.questionsArray[this.cnt-1].eq + " " + this.questionsArray[this.cnt-1].prt2),
          answer: answer
        }
        const updateMissedQuestions = collection(this.firestore, `users/${this.sharedVarService.getUserUID()}/courses/college-math/missed-questions/`);
        addDoc(updateMissedQuestions, userData)
      }
      this.clickedButton.style.backgroundColor = "#49beb7"
      this.clickedButton.style.setProperty('border-color', '#49beb7', 'important')
      this.clickedButton.style.setProperty('color', '#FFFFFF', 'important')
      this.sharedVarService.totalCorrectQuestions++;
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach((button: Element) => {
        const buttonElement = button as HTMLButtonElement;
        buttonElement.disabled = true;
      });
    }

    else{
      const userData = {
        question: (this.questionsArray[this.cnt-1].prt1 + " " + this.questionsArray[this.cnt-1].eq + " " + this.questionsArray[this.cnt-1].prt2),
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
  }


 /* getSummary() {
    if (this.stepperIndex == 2) {
      this.stepperIndex++;
    }
    var summary = '';
    this.afs
      .collection(
        '/courses/college-math/topics/' +
          this.sharedVarService.getTopic() +
          '/learner-type/' +
          this.sharedVarService.getLearnerType() +
          '/summary'
      )
      .snapshotChanges()
      .subscribe((summary) => {
        summary.map((f: any) => {
          this.p1 = f.payload.doc.data().summary;
          this.header = 'Summary';
        });
      });

    this.storyCheck = false;
    return summary;
  }*/

  async getSummary() {
    if (this.stepperIndex == 2) {
      this.stepperIndex++;
    }
    var summary = ''
    const topic = this.sharedVarService.getTopic();
    const learnerType = this.sharedVarService.getLearnerType();
    const summaryRef = collection(this.firestore, `/courses/college-math/topics/${topic}/learner-type/${learnerType}/summary`);

    try {
      const querySnapshot = await getDocs(summaryRef);
      querySnapshot.forEach(doc => {
        const data = doc.data();
        this.p1 = data['summary'];
        this.header = 'Summary';
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
      // Handle error here
    }

    this.storyCheck = false;
    return summary
  }

  async returnToCoursePage() {
    this.getCompletedTopics();
    console.log("going back to course")
    this.sharedVarService.setCompletedTopicsArray(this.completedTopicsArray);
    this.router.navigate(['course']);
  }

/*
  async getCompletedTopics(){
    return await this.afs.collection(`users/${this.sharedVarService.getUserUID()}/courses/college-math/topicsCompleted/`, ref => ref.where('name', '==', this.sharedVarService.getTopic().toString())).get().subscribe(snapshot => {
      if(snapshot.empty){
        const updateTopicsCompleted = collection(this.firestore, `users/${this.sharedVarService.getUserUID()}/courses/college-math/topicsCompleted/`);
        console.log("adding topic to database")
        this.completedTopicsArray.push({topicName: this.sharedVarService.getTopic()});
        addDoc(updateTopicsCompleted, {name: this.sharedVarService.getTopic().toString()});
        return;
      }
    });
  }*/

  async getCompletedTopics() {
    const userUid = this.sharedVarService.getUserUID();
    const topic = this.sharedVarService.getTopic();

    const topicsCompletedRef = collection(this.firestore, `users/${userUid}/courses/college-math/topicsCompleted/`);
    const queryRef = query(topicsCompletedRef, where('name', '==', topic.toString()));

    try {
      const querySnapshot = await getDocs(queryRef);
      if (querySnapshot.empty) {
        console.log("Adding topic to database");
        this.completedTopicsArray.push({ topicName: topic });
        const updateTopicsCompleted = collection(this.firestore, `users/${userUid}/courses/college-math/topicsCompleted/`);
        await addDoc(updateTopicsCompleted, { name: topic.toString() });
      }
    } catch (error) {
      console.error('Error fetching completed topics:', error);
      // Handle error here
    }
  }

}
