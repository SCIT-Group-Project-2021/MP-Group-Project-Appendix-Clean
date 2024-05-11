import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedVarService } from '../shared-var.service';

@Component({
  selector: 'app-settings-pane',
  templateUrl: './settings-pane.component.html',
  styleUrl: './settings-pane.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({opacity: 0, transform: 'scale(0.8)'})) ,
      transition('void <=> *',[
        animate('.2s')
      ])
    ])
  ]
})
export class SettingsPaneComponent {
frequency: number = 1;
numberOfQuestions: number = 10;
frequencyInterval: string = 'day';
userPhoto : any = "https://lastfm.freetls.fastly.net/i/u/avatar170s/bb5f03f35819e0d7bacbb2488f0a9ba9";

constructor(private sharedVarService : SharedVarService) { }


uploadImage() {
  throw new Error('Method not implemented.');
}
learnerType: String = this.sharedVarService.getLearnerType();

ngOnInit() { 
  switch(this.sharedVarService.getLearnerType()){
    case "theorist":
      this.userPhoto = "./assets/images/theorist.png";
      break;
    case "pragmatist":
      this.userPhoto = "./assets/images/pragmatist.png";
      break;
    case "reflector":
      this.userPhoto = "./assets/images/reflector.png";
      break;
    case "activist":
      this.userPhoto = "./assets/images/activist.png";
      break;
  }
  getLearnerType();
  getProfilePicture();
}

}
function getLearnerType() {
  throw new Error('Function not implemented.');
}

function getProfilePicture() {
  throw new Error('Function not implemented.');
}

