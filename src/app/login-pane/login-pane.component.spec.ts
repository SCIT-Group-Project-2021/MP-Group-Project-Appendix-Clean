import { AuthenticationService } from './services/authentication.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPaneComponent } from './login-pane.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

describe('LoginPaneComponent', () => {
  let component: LoginPaneComponent;
  let fixture: ComponentFixture<LoginPaneComponent>;
  let page: any;
  let location : Location;
  let authenticationService : AuthenticationServiceMock;
  let dialog : DialogMock;

  beforeEach(async () => {
    authenticationService = new AuthenticationServiceMock();
    dialog = new DialogMock();
    await TestBed.configureTestingModule({
      declarations: [LoginPaneComponent],
      imports:  [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {path: 'dashboard', component: DashboardComponent}
        ])
      ]
    })
    .overrideProvider(AuthenticationService, {useValue : authenticationService})
    .overrideProvider(MatDialog, {useValue: dialog})
    .compileComponents();

    fixture = TestBed.createComponent(LoginPaneComponent);
    location = TestBed.inject(Location);

    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  describe('given form', () => {
    //recover pwd btn conditions
    it('when email is empty, then recover password button should be disabled', () => {
      setEmail('');

      expect(recoverPasswordButton().disabled).toBeTruthy();
    })

    it('when email is invalid, then recover password button should be disabled', () => {
      setEmail('invalidEmail');

      expect(recoverPasswordButton().disabled).toBeTruthy();
    })

    it('when email is valid, then recover password should be enabled', () => {
      setEmail('valid@email.com');

      expect(recoverPasswordButton().disabled).toBeFalsy();
    })

    //log in disable conditions - email
    it('when email is empty, then log in button should be disabled', () => {
      setEmail('');
      setPassword('anyPassword');

      expect(logInButton().disabled).toBeTruthy();
    })

    it('when email is invalid, then log in button should be disabled', () => {
      setEmail('invalidEmail');
      setPassword('anyPassword');

      expect(logInButton().disabled).toBeTruthy();
    })

    it('when email is valid, then log in button should be enabled', () => {
      setEmail('valid@email.com');

      expect(logInButton().disabled).toBeFalsy();
    })

    //log in disable conditions - password
    it('when password is empty, then log in button should be disabled', () => {
      setEmail('valid@email.com');
      setPassword('');

      expect(logInButton().disabled).toBeTruthy();
    })

    it('when password is not empty, then log in button should be enabled', () => {
      setEmail('valid@email.com');
      setPassword('anyPassword');

      expect(logInButton().disabled).toBeFalsy();
    })

  })

  function setEmail(value : string){
    component.form.get('email')?.setValue(value);
    fixture.detectChanges();
  }

  function setPassword(value : string){
    component.form.get('password')?.setValue(value);
    fixture.detectChanges();
  }

  function recoverPasswordButton(){
    return page.querySelector('[test-id="recover-password-btn"]');
  }

  function logInButton(){
    return page.querySelector('[test-id="log-in-button"]');
  }

  function logInLoaderButton(){
    return page.querySelector('[test-id="log-in-loader"]');
  }

  describe('Login Flow', () => {

    describe('given user clicks on login button', () => {

      beforeEach(() => {
        setEmail('valid@email.com');
        setPassword('anyPassword');
        logInButton().click();
        fixture.detectChanges();
      })
      it('then show login loader', () => {
        expect(logInLoaderButton()).not.toBeNull();
      })

      it('then hide login button', () => {
        expect(logInButton()).toBeNull();
      })


      describe('when login is successful', () =>{
        beforeEach(() => {
          //authenticationService._signInResponse.next({id: "anyUserId"});
        })

        it('then go to dashboard', done => {
          setTimeout(() =>{
            expect(location.path()).toEqual('/dashboard');
            done();
          }, 100)

        })
      })

      describe('when login is unsuccessful', () =>{
        beforeEach(() => {
          //authenticationService._signInResponse.error({message: "anyError"});
          fixture.detectChanges();
        })
        it('then do not go to dashboard', done => {
          setTimeout(() =>{
            expect(location.path()).not.toEqual('/dashboard');
            done();
          }, 100)

          it('then hide log in loader', () => {
            expect(logInLoaderButton()).toBeNull();
          })
        })

        it('then show log in button', () => {
          expect(logInButton()).not.toBeNull();
        })

        it('then show error message', () =>{
          expect(dialog._isOpened).toBeTruthy();
        })
      })
    })

  })


});

class AuthenticationServiceMock {
  _signInResponse = new Subject();
 signIn() {
    return this._signInResponse.asObservable();
 }
}

class DialogMock {
  _isOpened = false;
  open() {
    this._isOpened = true;
  }
}
