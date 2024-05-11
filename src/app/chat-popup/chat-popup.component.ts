import { SharedVarService } from './../shared-var.service';
import { Component, inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../gemini.service';
import { ConvertTextToHtmlPipe } from '../convert-text-to-html.pipe';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrl: './chat-popup.component.scss',
  animations: [
    trigger('expand', [
      state('void', style({opacity: 0,transform: 'translatey(1000px)'})) ,
      transition('* <=> *',[
        animate('0.6s')
      ])
    ]),
    trigger('fade', [
      state('void', style({opacity: 0, transform: 'scale(0.8)'})) ,
      transition('* <=> *',[
        animate('.2s')
      ])
    ])
  ]

})
export class ChatPopupComponent {
  hidden: boolean = false
  buttonIcon: string = "send"
  prompt: string = '';

  geminiService: GeminiService = inject(GeminiService);

  loading: boolean = false;
  chatHistory:any[] =[];
  constructor(
    private sharedVarService: SharedVarService
  ){
    this.geminiService.getMessageHistory().subscribe((res) =>{
      if(res){
        this.chatHistory.push(res);
      }
    })
  }

  toggleChat(){
    this.hidden = !this.hidden;
    if(this.hidden){
      this.buttonIcon = "close"
    }
    else{
      this.buttonIcon = "send"
    }

 }

 async sendMessage(){
    if(this.prompt){
      this.loading = true;
      console.log(this.loading);
      const data = this.prompt;
      this.prompt = '';

      this.loading = await this.geminiService.generateText(data);
      console.log(this.loading);
    }
 }

 formatText(text: string){
  const result = text.replaceAll('*','')
  return result;
 }

 questionHelp(){
  this.prompt = "Help me solve this question: " + this.sharedVarService.getQuestion();
  this.sharedVarService.setUsedChat(true);
  this.sendMessage()
 }

}
