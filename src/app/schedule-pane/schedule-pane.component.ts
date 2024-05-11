import { Component } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, hoursToMinutes, millisecondsToHours, hoursToMilliseconds } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import e from 'express';
import { SharedVarService } from '../shared-var.service';

@Component({
  selector: 'app-schedule-pane',
  templateUrl: './schedule-pane.component.html',
  styleUrls: ['./schedule-pane.component.scss'],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
      transition('void <=> *', [
        animate('.2s')
      ])
    ])
  ]
})
export class SchedulePaneComponent {


  constructor(private router: Router, private sharedVarService: SharedVarService) {

  }

  ngOnInit() {
    // TODO: push and pull this to the database
    //this.events = this.sharedVarService.getEvents();
  }

  //TODO: Make final exam tag for statistics
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [{
    start: new Date('2024-05-06, 00:00:00'),
    end: new Date('2024-05-06, , 23:59:59'),
    title: "Final Test",
    draggable: true,
    resizable: {
      beforeStart: true,
      afterEnd: true,
    },
    color: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    }
  }];
  addOption: boolean = false;
  allDay!: boolean;
  eventLength: any;
  clickedDate!: Date;
  eventName: string = "";
  clickedColumn!: number;
  startAllDayEvent: any;
  startDateEvent: any;

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }

  addEvent(startDate: Date,endDate: Date, eventName: string): void {
    const newEvent: CalendarEvent = {
      start: startDate,
      end: endDate,
      title: eventName,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      color: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
      }
    };
    this.events = [...this.events, newEvent];
  }

  allDayToggle() {
    this.allDay = !this.allDay;
  }

  addCalendarEvent(event: any,allday: boolean): void {
    console.log(event);
    console.error(event);
    this.allDay = allday;
    if (allday) {
      this.startAllDayEvent = event.day.date;
    }else {
      this.startDateEvent = event.date;
    }
    this.addOption = !this.addOption
  }

  confirmEvent() {
    this.addOption = !this.addOption
    if (this.allDay) {

      const selectedDate: Date = startOfDay(this.startAllDayEvent);
      const endTime: Date = endOfDay(this.startAllDayEvent);
      const name: string = this.eventName;
      this.addEvent(selectedDate,endTime, name);
    }else {
      const selectedDate: Date = this.startDateEvent;
      const endTime: Date = new Date(this.startDateEvent.getTime() + hoursToMilliseconds(this.eventLength));
      const eventName: string = this.eventName;
      this.addEvent(selectedDate,endTime, eventName);
    }
    this.sharedVarService.setEvents(this.events);
  }

  onDayClick(event: any): void {
    alert('Clicked day: ' + startOfDay(event.day.date));
    const selectedDate: Date = startOfDay(event.day.date);
    const endTime: Date = endOfDay(event.day.date);
    const eventName: string = prompt('Enter event name:')!;

    if (eventName) {
      this.addEvent(selectedDate,endTime, eventName);
    }
  }

  onHourSegmentClick(event: any) {
    alert('Clicked date: ' + event.date);
    const selectedDate: Date = event.date;
    const eventName: string = prompt('Enter event name:')!;

    const endTime: Date = new Date(selectedDate.getTime() + hoursToMilliseconds(1));
    if (eventName) {
      this.addEvent(selectedDate,endTime, eventName);
    }
  }
}
