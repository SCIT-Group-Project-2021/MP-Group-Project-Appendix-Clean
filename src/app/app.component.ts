import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedVarService } from './shared-var.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'MP-Project';

    constructor(private  router: Router,private sharedVarService : SharedVarService) {
    }

    ngOnInit() { 
      this.sharedVarService.isLoading().subscribe(value => {
        console.log('Received boolean value in Component1:', value);
        this.isloading = value;
      });
    }

    isloading: boolean = false;

    isLoggedIn() {
      //checks to see if youre on login screen
      if(this.router.url != '/' && this.router.url != '/register' && this.router.url != '/quiz'){
        return this.router.url;
      };
      return false;
    }

    onContentPage() {
      //shows the chatbot on specific pages
      if( this.router.url == '/topic' || this.router.url == '/quiz-pane' || this.router.url == '/missed-questions-pane'){
        return this.router.url;
      };
      return false;
    }

}
