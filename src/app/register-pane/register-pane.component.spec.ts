import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPaneComponent } from './register-pane.component';
import { Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';

describe('RegisterPaneComponent', () => {
  let component: RegisterPaneComponent;
  let fixture: ComponentFixture<RegisterPaneComponent>;
  let page: any;
  let location : Location;
  let dialog : DialogMock;

  beforeEach(async () => {
    dialog = new DialogMock();
    await TestBed.configureTestingModule({
      declarations: [RegisterPaneComponent],
      imports: [
        ReactiveFormsModule
      ]
    })
    .overrideProvider(MatDialog, {useValue: dialog})
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPaneComponent);
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

      expect(registerButton().disabled).toBeTruthy();
    })

    it('when email is invalid, then log in button should be disabled', () => {
      setEmail('invalidEmail');
      setPassword('anyPassword');

      expect(registerButton().disabled).toBeTruthy();
    })

    it('when email is valid, then log in button should be enabled', () => {
      setEmail('valid@email.com');

      expect(registerButton().disabled).toBeFalsy();
    })

    //log in disable conditions - password
    it('when password is empty, then log in button should be disabled', () => {
      setEmail('valid@email.com');
      setPassword('');

      expect(registerButton().disabled).toBeTruthy();
    })

    it('when password is not empty, then log in button should be enabled', () => {
      setEmail('valid@email.com');
      setPassword('anyPassword');

      expect(registerButton().disabled).toBeFalsy();
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

  function registerButton(){
    return page.querySelector('[test-id="register-button"]');
  }

  function registerLoaderButton(){
    return page.querySelector('[test-id="register-loader"]');
  }

  describe('Login Flow', () => {

    describe('given user clicks on login button', () => {

      beforeEach(() => {
        setEmail('valid@email.com');
        setPassword('anyPassword');
        registerButton().click();
        fixture.detectChanges();
      })
      it('then show login loader', () => {
        expect(registerLoaderButton()).not.toBeNull();
      })

      it('then hide login button', () => {
        expect(registerButton()).toBeNull();
      })

      describe('when login is successful', () =>{
        beforeEach(() => {
          //authenticationService._signInResponse.next({id: "anyUserId"});

        })

        it('then go to dashboard', done => {
          setTimeout(() =>{
            expect(location.path()).toEqual('/learnerTypeQuiz');
            done();
          }, 100)

        })
      })

      describe('when register is unsuccessful', () =>{
        beforeEach(() => {
          //authenticationService._signInResponse.error({message: "anyError"});
          fixture.detectChanges();
        })
        it('then do not go to dashboard', done => {
          setTimeout(() =>{
            expect(location.path()).not.toEqual('/learnerTypeQuiz');
            done();
          }, 100)

          it('then hide log in loader', () => {
            expect(registerLoaderButton()).toBeNull();
          })
        })

        it('then show log in button', () => {
          expect(registerButton()).not.toBeNull();
        })

        it('then show error message', () =>{
          expect(dialog._isOpened).toBeTruthy();
        })
      })
    })

  })

});

class DialogMock {
  _isOpened = false;
  open() {
    this._isOpened = true;
  }
}
