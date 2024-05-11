import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-bar',
  templateUrl: './navbar-bar.component.html',
  styleUrl: './navbar-bar.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({opacity: 0,transform: 'translate(-100px)'})) ,
      transition('void <=> *',[
        animate('0.2s')
      ])
    ]),
    trigger('expand',
    [
      state('open',
      style({
        width: '350px',
        filter: 'drop-shadow(2px 1px 1px #d8d8d8)'
      })),
      state('closed',
        style({
        width: '75px',
        filter: 'drop-shadow(0px 0px 0px #d8d8d8)'
      })),
      transition('* => open', [animate('0.1s')]),
      transition('* => closed', [animate('.2s')]),
    ])
  ]
})
export class NavbarBarComponent {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ){}

  buttonText!: HTMLCollectionOf<Element>;
  goalElement!: HTMLElement;

  goToTab(goal: string, text: string) {
    console.log("We went to " + goal + " tab");
    this.router.navigate([goal])
    //this.resetcolor();
    try {
      this.goalElement = document.getElementById(goal)!;
      //this.goalElement.style.color = "#49BEB7";
    } catch (error) {
    }
  }

  resetcolor() {
    this.buttonText = document.getElementsByClassName("iconText") as HTMLCollectionOf<Element>;
    for (let i = 0; i < this.buttonText.length; i++) {
      (this.buttonText[i] as HTMLElement).style.color = "black";
    }
    //TODO: fix color change on click; not allowing color change after reset
  }

  logOut(){
    // Set persistence to none to prevent auto-login
    this.afAuth.setPersistence('none')
    .then(() => {
      // Sign out the user
      return this.afAuth.signOut();
    })
    .then(() => {
      // Redirect to the login page
      this.router.navigate(['']); // Assuming '/login' is your login page route
    })
    .catch(error => {
      console.error('Logout error:', error);
    });
  }

  isOpen= false;

  animate() {
    this.isOpen = !this.isOpen;
    //alert(this.isOpen);
  }
}
