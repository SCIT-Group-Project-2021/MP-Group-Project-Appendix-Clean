import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterPaneService {

  constructor( private auth: AngularFireAuth) { }

  register(params: Resgister): Observable<any>{
    return from(this.auth.createUserWithEmailAndPassword(
      params.email, params.password
    ));
  }
}

type Resgister = {
  email : string;
  password: string;
}
