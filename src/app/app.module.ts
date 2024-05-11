import { NgModule } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { NgOptimizedImage } from '@angular/common'
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CountdownComponent, provideCountdown } from 'ngx-countdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginPaneComponent } from './login-pane/login-pane.component';
import { NavbarBarComponent } from './navbar-bar/navbar-bar.component';
import { ReviewPaneComponent } from './review-pane/review-pane.component';
import { QuizPaneComponent } from './quiz-pane/quiz-pane.component';
import { SchedulePaneComponent } from './schedule-pane/schedule-pane.component';
import { RegisterPaneComponent } from './register-pane/register-pane.component';
import { QuizComponent } from './quiz/quiz.component';
import { TopbarComponent } from './topbar/topbar.component';
import { CoursePaneComponent } from './course-pane/course-pane.component';
import { TopicPaneComponent } from './topic-pane/topic-pane.component';
import { RegisterErrorDialogComponent } from './register-error-dialog/register-error-dialog.component';
import { LoginErrorDialogComponent } from './login-error-dialog/login-error-dialog.component';
import { LatexParagraphComponent } from './latex-paragraph/latex-paragraph.component';
import { SharedVarService } from './shared-var.service';
import { environment } from '../environments/environment.development';


import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ChartModule } from 'primeng/chart';

import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { SettingsPaneComponent } from './settings-pane/settings-pane.component';
import { ChatPopupComponent } from './chat-popup/chat-popup.component';
import { ConvertTextToHtmlPipe } from './convert-text-to-html.pipe';
import { MissedQuestionsPaneComponent } from './missed-questions-pane/missed-questions-pane.component';
import { LoadingPaneComponent } from './loading-pane/loading-pane.component';
import { AuthGuard } from './guards/auth.guard';


firebase.initializeApp({apiKey: "AIzaSyAjF9xbYVPbyhIcru7VHPKSnsxdrQG0usU",
authDomain: "smartlearn-bef15.firebaseapp.com",
projectId: "smartlearn-bef15",
storageBucket: "smartlearn-bef15.appspot.com",
messagingSenderId: "490282082328",
appId: "1:490282082328:web:33fe76a29244d075dca36d",
measurementId: "G-KJNQYGJ133"
});

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginPaneComponent,
    NavbarBarComponent,
    LoginErrorDialogComponent,
    RegisterPaneComponent,
    RegisterErrorDialogComponent,
    QuizComponent,
    TopbarComponent,
    CoursePaneComponent,
    TopicPaneComponent,
    ReviewPaneComponent,
    QuizPaneComponent,
    SchedulePaneComponent,
    SettingsPaneComponent,
    ChatPopupComponent,
    ConvertTextToHtmlPipe,
    MissedQuestionsPaneComponent,
    LoadingPaneComponent
  ],
  imports: [
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAjF9xbYVPbyhIcru7VHPKSnsxdrQG0usU",
      authDomain: "smartlearn-bef15.firebaseapp.com",
      projectId: "smartlearn-bef15",
      storageBucket: "smartlearn-bef15.appspot.com",
      messagingSenderId: "490282082328",
      appId: "1:490282082328:web:33fe76a29244d075dca36d",
      measurementId: "G-KJNQYGJ133"
    }),
    BrowserModule,
    FormsModule,
    LatexParagraphComponent,
    AppRoutingModule,
    MatDividerModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSliderModule,
    NgOptimizedImage,
    MatTooltipModule,
    ChartModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatIconModule,
    MatSnackBarModule,
    CountdownComponent,
    MatSelectModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatStepperModule,
    MatCardModule,
    MatFormFieldModule,
    AngularFireAuthModule,
    ScrollPanelModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  providers: [
    AuthGuard,
    provideClientHydration(),
    provideAnimationsAsync(),
    MatDatepickerModule,
    SharedVarService,
    provideAnimations(),
    provideCountdown({ format: `mm:ss` }),
    {provide : LocationStrategy , useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
