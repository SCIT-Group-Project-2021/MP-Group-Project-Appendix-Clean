import { Injectable } from '@angular/core';
import { ChatSession, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, Part } from '@google/generative-ai';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConvertTextToHtmlPipe } from './convert-text-to-html.pipe';
import { GeminiConfig } from './chat-form';
import { parts } from './parts-prompt';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private generativeAI: GoogleGenerativeAI;
  private messageHistory: BehaviorSubject<any> = new BehaviorSubject(null);
  private convertText : ConvertTextToHtmlPipe
  //promptParts: Part[] = []

  constructor() {
    //TODO: Encrypt key
    this.generativeAI = new GoogleGenerativeAI('');
    this.convertText = new ConvertTextToHtmlPipe();

  }

  async generateText(prompt: string){
    const model = this.generativeAI.getGenerativeModel({model: 'gemini-pro'});
    this.messageHistory.next({
      from: 'user',
      message: prompt
    });

    const generationConfig = {
      temperature: 0.5,
      topK: 1,
      topP: 1
    };
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

      parts.push({ text: `input: ${prompt}` });
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
      });

      const response = result.response;
      parts.push({ text: `output: ${response.text()}` });
      const text = this.convertText.transform(response.text())//response.text();
      console.log(text);
      this.messageHistory.next({
        from: 'bot',
        message: text
      });
      return false;
  }

  public getMessageHistory(): Observable<any>{
    return this.messageHistory.asObservable();
  }

  async generateMSA(prompt: string){
    const model = this.generativeAI.getGenerativeModel({model: 'gemini-pro'});

    const result = await model.generateContent(prompt)
    const response = await result.response;
    const str = response.text();
    const array = str.split(/",\s?"/).map(item => item.replace(/"/g, ''));
    console.log(array)
    return array;
  }


  async generateMSQ(prompt: string){
    const model = this.generativeAI.getGenerativeModel({model: 'gemini-pro'});

    const result = await model.generateContent(prompt)
    const response = await result.response;
    const str = response.text();
    console.log("String response from Gemini: " + str);
    const array = str.split(/",\s?"/).map(item => item.replace(/"/g, '').replace(/\n/g, '',).replace(/\^(\([^)]*\))/g, '^{$1}'));
    console.log("Array result: " + array);
    return array;
  }

  async generateFeedback(prompt: string){
    const model = this.generativeAI.getGenerativeModel({model: 'gemini-pro'});

    const generationConfig = {
      temperature: 0.5,
      topK: 1,
      topP: 1
    };
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

      parts.push({ text: `input: ${prompt}` });
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
      });

      const response = result.response;
      parts.push({ text: `output: ${response.text()}` });
      const text = this.convertText.transform(response.text())//response.text();
      console.log(text);
      return text;
  }

}


