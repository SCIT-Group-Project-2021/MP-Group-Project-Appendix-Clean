import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPaneComponent } from './login-pane/login-pane.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterPaneComponent } from './register-pane/register-pane.component';
import { QuizComponent } from './quiz/quiz.component';
import { CoursePaneComponent } from './course-pane/course-pane.component';
import { TopicPaneComponent } from './topic-pane/topic-pane.component';
import { ReviewPaneComponent } from './review-pane/review-pane.component';
import { QuizPaneComponent } from './quiz-pane/quiz-pane.component';
import { SchedulePaneComponent } from './schedule-pane/schedule-pane.component';
import { SettingsPaneComponent } from './settings-pane/settings-pane.component';
import { MissedQuestionsPaneComponent } from './missed-questions-pane/missed-questions-pane.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginPaneComponent,
    title: 'Smart Learn'
  },
  {
    path: 'register',
    component: RegisterPaneComponent,
    title: 'Smart Learn'
  },
  {
    path: 'quiz',
    component: QuizComponent,
    title: 'Smart Learn'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Smart Learn', canActivate: [AuthGuard]
  },
  {
    path: 'course',
    component: CoursePaneComponent,
    title: 'Smart Learn', canActivate: [AuthGuard]
  },
  {
    path: 'topic',
    component: TopicPaneComponent,
    title: 'Smart Learn', canActivate: [AuthGuard]
  },
  {
    path: 'review',
    component: ReviewPaneComponent,
    title: 'Smart Learn', canActivate: [AuthGuard]
  },
  {
    path: 'quiz-pane',
    component: QuizPaneComponent,
    title: 'Smart Learn', canActivate: [AuthGuard]
  },
  {
    path: 'missed-questions-pane',
    component: MissedQuestionsPaneComponent,
    title: 'Smart Learn', canActivate: [AuthGuard]
  },
  {
    path: 'schedule',
    component: SchedulePaneComponent,
    title: 'Smart Learn', canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsPaneComponent,
    title: 'Smart Learn', canActivate: [AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


  //#TODO: 'Add Secure routing'
