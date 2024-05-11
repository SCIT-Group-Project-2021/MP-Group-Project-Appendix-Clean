import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { SharedVarService } from '../shared-var.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { log } from 'util';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 1, flex: 1 })),
      transition('void <=> *', [
        animate('.6s')
      ])
    ]),
    trigger('invert', [
      state('void', style({ opacity: '0', flex: 0 })),
      transition('void <=> *', [
        animate('.6s')
      ])
    ]),
    trigger('fade', [
      state('void', style({ opacity: 1, flex: 1 })),
      transition('hidden <=> *', [
        animate('.6s')
      ])
    ])]
})


export class QuizComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') private myStepper!: MatStepper;
  totalStepsCount!: number;

  constructor(
    private router: Router,
    private sharedVarService : SharedVarService,
    private afs : AngularFirestore,
    private afAuth: AngularFireAuth
  ){}

  pragmatist = 0
  theorist = 0
  activist = 0
  reflector = 0
  learnerType = ""
  learnerDescriptor= ""
  learnerImg = "";
  learnerColor = ""
  stepperI = -1


  reveal : boolean = false;


  goBack(){
    this.stepperI--;
  }
  // Event fired when component initializes
  ngOnInit() {
  }

  // Event fired after view is initialized
  ngAfterViewInit() {
    this.totalStepsCount = this.myStepper._steps.length;
    console.log( "before" + this.myStepper._steps.length);
  }

  goForward(){
    if(this.stepperI < this.myStepper._steps.length -1){
      this.stepperI++;
    }
  }

  questions = [
    {
    category: 1,
    description: "I like the sort of work where I have time for thorough preparation and implementation.",
    isTrue: null,
    isHidden: false,
    type: "Reflector"
    },
    {
    category: 1,
    description: "I tend to solve problems using a step-by-step approach.",
    isTrue: null,
    isHidden: true,
    type: "Theorist"
    },
    {
    category: 1,
    description: "When I hear about a new idea or approach, I immediately start working out how to apply it in practice.",
    isTrue: null,
    isHidden: true,
    type: "Pragmatist"
    },
    {
    category: 1,
    description: "I accept and stick to laid down procedures and policies so long as I regard them as an efficient way of getting the job done.",
    isTrue: null,
    isHidden: true,
    type: "Pragmatist"
    },
    {
    category: 1,
    description: "I prefer to respond to events on a spontaneous, flexible basis rather than plan things out in advance.",
    isTrue: null,
    isHidden: true,
    type: "Activist"
    },
    {
    category: 1,
    description: "I find the formality of having specific objectives and plans stifling.",
    isTrue: true,
    isHidden: true,
    type: "Activist"
    },
    {
    category: 1,
    description: "I quickly get bored with methodical, detailed work.",
    isTrue: true,
    isHidden: true,
    type: "Activist"
    },
    {
    category: 1,
    description: "I take pride in doing a thorough job.",
    isTrue: true,
    isHidden: true,
    type: "Reflector"
    },
    {
    category: 1,
    description: "It worries me if I have to rush out a piece of work to meet a tight deadline.",
    isTrue: true,
    isHidden: true,
    type: "Reflector"
    },
    {
    category: 1,
    description: "If I have a report to write I tend to produce lots of drafts before settling on the final version.",
    isTrue: true,
    isHidden: true,
    type: "Reflector"
    },
    {
    category: 1,
    description: "I tend to be a perfectionist.",
    isTrue: true,
    isHidden: true,
    type: "Theorist"
    },
    {
    category: 1,
    description: "I prefer to have as many sources of information as possible -the more data to mull over the better.",
    isTrue: true,
    isHidden: true,
    type: "Reflector"
    },
    {
      category: 1,
      description: "I thrive on the challenge of tackling something new and different.",
      isTrue: true,
      isHidden: true,
      type: "Activity"
      },
    {
    category: 2,
    description: "In discussions with people, I often find I am the most dispassionate and objective.",
    isTrue: true,
    isHidden: true,
    type: "Theorist"
    },
    {
    category: 2,
    description: "In discussions I'm more likely to adopt a 'low profile' than to take the lead and do most of the talking.",
    isTrue: true,
    isHidden: true,
    type: "Reflector"
    },
    {
    category: 2,
    description: "I'm always interested to find out what people think.",
    isTrue: true,
    isHidden: true,
    type: "Reflector"
    },
    {
    category: 2,
    description: "I  enjoy the drama and excitement of a crisis.",
    isTrue: true,
    isHidden: true,
    type: "Activist"
    },
    {
      category: 2,
      description: "Flippant people who don't take things seriously enough usually irritate me.",
      isTrue: true,
      isHidden: true,
      type: "Theorist"
      },
    {
    category: 2,
    description: "In discussions I often find I am the realist, keeping people to the point and avoiding wild speculations.",
    isTrue: true,
    isHidden: true,
    type: "Pragmatist"
    },
    {
    category: 2,
    description: "In discussions I get impatient with irrelevancies and digressions.",
    isTrue: true,
    isHidden: true,
    type: "Pragmatist"
    },
    {
    category: 2,
    description: "In discussions I usually produce lots of spontaneous ideas.",
    isTrue: true,
    isHidden: true,
    type: "Activist"
    },
    {
    category: 2,
    description: "I like meetings to be run on methodical lines, sticking to laid down agenda, etc.",
    isTrue: true,
    isHidden: true,
    type: "Theorist"
    },
    {
    category: 2,
    description: "In meetings I put forward practical, realistic ideas.",
    isTrue: true,
    isHidden: true,
    type: "Pragmatist"
    },
    {
    category: 2,
    description: "I listen to other people's point of view before putting my own forward.",
    isTrue: true,
    isHidden: true,
    type: "Reflector"
    },
    {
    category: 2,
    description: "I often get irritated by people who want to rush things.",
    isTrue: true,
    isHidden: true,
    type: "Reflector"
    },
    {
    category: 2,
    description: "People often find me insensitive to their feelings.",
    isTrue: true,
    isHidden: true,
    type: "Pragmatist"
    },
    {
    category: 2,
    description: "I have a reputation for saying what I think, simply and directly.",
    isTrue: true,
    isHidden: true,
    type: "Pragmatist"
    },
    {
    category: 2,
    description: "I think written reports should be short and to the point.",
    isTrue: true,
    isHidden: true,
    type: "Pragmatist"
    },
    {
    category: 3,
    description: "I often find that actions based on feeling are as sound as those based on careful thought and analysis.",
    isTrue: true,
    isHidden: true,
    type: "Activist"
    },
    {
    category: 3,
    description: "I like to be able to relate current actions to a longer-term bigger picture.",
    isTrue: true,
    isHidden: true,
    type: "Theorist"
    },
    {
    category: 3,
    description: "I am keen on self-discipline such as watching my diet, taking regular exercise, sticking to a fixed routine etc.",
    isTrue: true,
    isHidden: true,
    type: "Theorist"
    },
    {
    category: 3,
    description: "When things go wrong, I am happy to shrug it off and 'put it down to experience'.",
    isTrue: true,
    isHidden: true,
    type: "Activist"
    },
    {
    category: 3,
    description: "I'm attracted more to novel, unusual ideas than to practical ones.",
    isTrue: true,
    isHidden: true,
    type: "Activist"
    },
    {
    category: 3,
    description: "I tend to reject wild, spontaneous ideas as being impractical.",
    isTrue: true,
    isHidden: true,
    type: "Pragmatist"
    },
    {
    category: 3,
    description: "I believe that formal procedures and policies restrict people.",
    isTrue: true,
    isHidden: true,
    type: "Activist"
    },
    {
    category: 3,
    description: "I pay meticulous attention to detail before coming to a conclusion.",
    isTrue: true,
    isHidden: true,
    type: "Reflector"
    },
    {
    category: 3,
    description: "I find it difficult to produce ideas on impulse.",
    isTrue: true,
    isHidden: true,
    type: "Theorist"
    },
    {
    category: 3,
    description: "I am keen on exploring the basic assumptions, principles and theories underpinning things and events.",
    isTrue: true,
    isHidden: true,
    type: "Theorist"
    },
    {
    category: 3,
    description: "I steer clear of subjective or ambiguous topics.",
    isTrue: true,
    isHidden: true,
    type: "Theorist"
    },
    {
    category: 3,
    description: "What matters most is whether something works in practice.",
    isTrue: true,
    isHidden: true,
    type: "Pragmatist"
    }
  ]

  categories = [
    {
      title: "Tell us about yourself",
      description: "Well get to know you and personalize an effective plan for your body, lifestyle, and goals.",
      isHidden: false,
      questionsHidden: true,
      button: "Begin",
      function: () => this.beginTestFunction()
    },
    {
      title: "Work Approach",
      description: "Someone's work approach reflects their organization, diligence, and adaptability in tackling tasks. A proactive and meticulous approach often signifies reliability, accountability, and a strong work ethic. Conversely, a more flexible approach may indicate creativity, adaptability, and innovation, while a disorganized approach may suggest challenges in time management and decision-making.",
      isHidden: true,
      questionsHidden: true,
      button: "Continue",
      function: () => this.workApproachFunction()
    },
    {
      title: "Communication Style",
      description: "Someone's communication style reflects their confidence, empathy, and approach to relationships. A direct and assertive style often signifies decisiveness and goal orientation, while a diplomatic approach prioritizes harmony and understanding. Conversely, a more empathetic and diplomatic communication style may suggest individuals who prioritize harmony, understanding, and collaboration in their relationships.",
      isHidden: true,
      questionsHidden: true,
      button: "Continue",
      function: () => this.communicationStyleFunction()
    },
    {
      title: "Cognitive Approach",
      description: "Someone's cognitive approach reveals their problem-solving style and adaptability. A logical and analytical approach suggests a focus on evidence-based reasoning, while an intuitive approach indicates creativity and adaptability.",
      isHidden: true,
      questionsHidden: true,
      button: "Continue",
      function: () =>this.cognitiveApproachFunction()
     },
     {
      title: "Results",
      description: "Well get to know you and personalize an effective plan for your body, lifestyle, and goals.",
      isHidden: true,
      questionsHidden: true,
      button: "Reveal",
      function: () => this.calculateLearner()
    }
  ];

  beginTestFunction() {
    console.log("beginTestFunction Called");
    this.nextCategory();
  }

  workApproachFunction() {
    console.log("workApproachFunction Called");
    this.next(1);
  }

  communicationStyleFunction() {
    console.log("communicationStyleFunction Called");
    this.next(2);
  }

  cognitiveApproachFunction() {
    console.log("cognitiveApproachFunction Called");
    this.next(3);
  }

  next(category: number) {
    const currentIndex = this.categories.findIndex(category => !category.isHidden);
    if (this.categories[currentIndex].questionsHidden != true) {
      this.nextQuestion(category);
    } else {
      this.categories[currentIndex].questionsHidden = false;
    }
  }

  nextQuestion(category: number) {
    console.log("nextQuestion Called");
    const currentQuestionIndex = this.questions.findIndex(questions => !questions.isHidden);
    //this.questions[currentQuestionIndex].category++
    if (currentQuestionIndex < this.questions.length - 1) {
      if(this.questions[currentQuestionIndex+1].category == category){
        this.questions[currentQuestionIndex].isHidden = true;
        this.questions[currentQuestionIndex + 1].isHidden = false;
      }
      else {
        try {
          this.questions[currentQuestionIndex].isHidden = true;
          this.questions[currentQuestionIndex + 1].isHidden = false;
        } catch (error) {

        }

        this.nextCategory();
      }
    } else {
    try {
        this.questions[currentQuestionIndex].isHidden = true;
        this.questions[currentQuestionIndex + 1].isHidden = false;
      } catch (error) {
        console.log("all questions asked")
      }
      this.nextCategory();
    }
  }

  nextCategory() {
    console.log("nextCategory Called");
    const currentIndex = this.categories.findIndex(category => !category.isHidden);

    try {
      this.categories[currentIndex].questionsHidden = true;
      this.goForward();
    } catch (error) {

    }

    if (currentIndex < this.categories.length -1) {
      this.categories[currentIndex].isHidden = true;
      this.categories[currentIndex + 1].isHidden = false;
    } else {
      console.log("all categories passed")
      this.endTest();
    }
  }

  async endTest() {
    await this.sendInfo();
    this.router.navigate(['dashboard']);
    //setTimeout(()=> { this.refresh()}, 5000);
  }

  refresh(){
    window.location.reload();
    window.alert("Please re-login.")
    this.logOut();
  }
  async sendInfo(){
    this.sharedVarService.setLearnerType(this.learnerType);
    return new Promise<void>(async (resolve) => {
      await this.afs.collection('/users/', ref => ref.where('__name__', '==', this.sharedVarService.getUserUID()).limit(1)).snapshotChanges().subscribe(res => {
        res.map((e: any) => {
          let id = this.sharedVarService.getUserUID();
          this.afs.doc('users/' + this.sharedVarService.getUserUID()).update({learnerType : this.learnerType.toLowerCase()});
        })

      }, err => {
        alert('Error while fetching learner type data')
      })

      console.log("pragmatist: "+this.pragmatist,"theorist: "+this.theorist,"activist: "+this.activist,"reflector: "+this.reflector)
      resolve();
    })

  }

  async calculateLearner () {
    var result = this.pragmatist;
    for (let index = 0; index < this.questions.length; index++) {
      if(this.questions[index].isTrue){
        switch (this.questions[index].type) {
          case "Pragmatist":
            this.pragmatist++;
            if(result < this.pragmatist){
              result = this.pragmatist;
              this.learnerType = "Pragmatist";
              this.learnerDescriptor = "Pragmatists are practical learners who value real-world applications and results-oriented approaches";
              this.learnerColor = "#63a2d0";
              this.learnerImg = "./assets/images/pragmatist.png";
            }
          break;

          case "Theorist":
            this.theorist++;
            if(result < this.theorist){
              result = this.theorist;
              this.learnerType = "Theorist";
              this.learnerDescriptor = "Theorists are analytical learners who excel in understanding complex concepts and frameworks, often preferring structured, logical explanations.";
              this.learnerColor = "#df98d6";
              this.learnerImg = "./assets/images/theorist.png";
            }
          break;

          case "Activist":
            this.activist++;
            if(result < this.activist){
              result = this.activist;
              this.learnerType = "Activist";
              this.learnerDescriptor = "Activists are hands-on learners who thrive on involvement and action, preferring experiential learning over passive observation.";
              this.learnerColor = "#9f77c5";
              this.learnerImg = "./assets/images/activist.png";
            }
          break;

          case "Reflector":
            this.reflector++;
            if(result < this.reflector){
              result = this.reflector;
              this.learnerType = "Reflector";
              this.learnerDescriptor = "Reflectors are contemplative learners who prefer to observe and analyze information before actively engaging with it.";
              this.learnerColor = "#76b97f";
              this.learnerImg = "./assets/images/reflector.png";
            }
          break;

          default:
            console.log("Question type unknown: " + this.questions[index].type)
          break;
        }
      }
    }

    this.reveal = true;
  }

  logOut(){
    window.alert('Logged out!');
    this.router.navigate(['']);
  }
}
