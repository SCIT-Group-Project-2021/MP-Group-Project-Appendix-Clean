import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getStorage, ref, getDownloadURL } from '@angular/fire/storage'
import { SharedVarService } from '../shared-var.service';

interface ButtonStates {
  addButton: string;
  notifButton: string;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({opacity: 0, transform: 'scale(0.9)'})) ,
      transition('void <=> *',[
        animate('.2s')
      ])
    ]),
    trigger('scale',
    [
      state('scaled',
        style({
          transform: 'scale(1.2)'
      })),
      transition('* => scaled', [animate('0.1s')]),
      transition('scaled => *', [animate('.2s')]),
    ]),
  ]
})
export class TopbarComponent {
  username: any = "";
  userPhoto : any = "https://lastfm.freetls.fastly.net/i/u/avatar170s/bb5f03f35819e0d7bacbb2488f0a9ba9";
  storage = getStorage();
  overlayEnabled: boolean = false;

  constructor(private auth : AngularFireAuth, private sharedVarService : SharedVarService){
    this.auth.authState.subscribe((data) => {
      if(data){
        this.username = data.displayName;
        //this.userPhoto = data.photoURL;
        const img = document.getElementById('profileImg');
        img?.setAttribute('src', "");
        console.log("photo url "+ this.userPhoto)
      }
    })
  }

  ngOnInit(){
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
  }

  buttonStates: ButtonStates = {
    addButton: 'default',
    notifButton: 'default'
  };

  animateButton(button: keyof ButtonStates) {
    this.buttonStates[button] = this.buttonStates[button] === 'scaled' ? 'default' : 'scaled';
  }

  toggleOverlay() {
    this.overlayEnabled = !this.overlayEnabled;
  }

}
