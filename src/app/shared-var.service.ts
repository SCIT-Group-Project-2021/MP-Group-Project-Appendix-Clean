import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { BehaviorSubject, Observable } from 'rxjs';
export interface topicNames {
  topicName: string;
}

@Injectable({
  providedIn: 'root'
})

export class SharedVarService {

  userUID!: string;
  topic!: string;
  learnerType!: string;
  timer!: boolean;
  multipleChoice!: boolean;
  completedTopics: boolean = false;
  completedTopicsArray: topicNames[] = [];
  questionsArray: string[] = [];
  questionCnt :number = 10;
  answersArray: string[] = [];
  timerValue!: number;
  question!: string;
  currentStreak!: number;
  longestStreak!: number;
  completedQuizCnt!: number;
  totalCorrectQuestions!: number;
  totalSessions!: number;
  usedChat!: boolean;
  feedback: string = '';
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  events: CalendarEvent[] = [];

  getQuestionCnt(){
    return this.questionCnt;
  }

  setQuestionCnt(val: number){
    this.questionCnt = val;
  }

  isLoading(): Observable<boolean>{
    console.log('isLoading');
    return this.loading.asObservable();
  }

  setLoading(val: boolean){
    console.log('isLoading');
    this.loading.next(val);
  }

  setFeedback(val: string){
    this.feedback = val;
  }

  getFeedback(){
    return this.feedback;
  }

  setTotalSessions(val: number){
    this.totalSessions = val;
  }
  getTotalSessions(){
    return this.totalSessions;
  }

  getUsedChat(){
    return this.usedChat;
  }

  setUsedChat(val: boolean){
    this.usedChat = val;
  }

  setTotalCorrectQuestions(val: number){
    this.totalCorrectQuestions = val;
  }
  getTotalCorrectQuestions(){
    return this.totalCorrectQuestions;
  }

  setCompletedQuizCnt(val: number){
    this.completedQuizCnt = val;
  }
  getcompletedQuizCnt(){
    return this.completedQuizCnt;
  }

  setCurrentStreak(val: number){
    this.currentStreak = val;
  }
  getCurrentStreak(){
    return this.currentStreak;
  }

  setLongestStreak(val: number){
    this.longestStreak = val;
  }
  getLongestStreak(){
    return this.longestStreak;
  }

  getQuestionsArray(){
    return this.questionsArray;
  }

  setQuestionsArray(val: string[]){
    this.questionsArray = val;
  }

  getAnswersArray(){
    return this.answersArray;
  }

  setAnswersArray(val: string[]){
    this.answersArray = val;
  }

  getCompletedTopicsArray(){
    return this.completedTopicsArray;
  }

  setCompletedTopicsArray(val: topicNames[]){
    this.completedTopicsArray = val;
  }

  getCompletedTopics(){
    return this.completedTopics;
  }

  setCompletedTopics(val: boolean){
    this.completedTopics = val;
  }

  setQuestion(val: string, val2: string, val3: string){
    this.question = val + " " + val2 + " " + val3;
  }

  setQuestionString(val: string){
    this.question = val;
  }
  getQuestion(){
    return this.question;
  }

  setUserUID(val: string){
    this.userUID = val;
  }

  getUserUID(){
    return this.userUID;
  }

  setTopic(val: string){
    this.topic = val;
  }

  getTopic(){
    return this.topic;
  }

  setLearnerType(val: string){
    this.learnerType = val;
  }

  getLearnerType(){
    return this.learnerType;
  }

  getTimer(){
    return this.timer;
  }

  setTimer(val: boolean){
    this.timer = val;
  }

  getTimerValue(){
    return this.timerValue;
  }

  setTimerValue(val: number){
    this.timerValue = val;
  }

  getMultipleChoice(){
    return this.multipleChoice;
  }

  setMultipleChoice(val: boolean){
    this.multipleChoice = val;
  }

  getEvents() {
    return this.events;
  }

  setEvents(events: CalendarEvent[]) {
    this.events = events;
  }


}
