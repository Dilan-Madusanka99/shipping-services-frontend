import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';

function seafarerIdExistsValidator(httpService: HttpService): AsyncValidatorFn {
  return (control: AbstractControl) => {

    if (!control.value) {
      return of(null);
    }

    return httpService.checkSeafarerIdUniqueness(control.value)
      .then((response: any) => {
        return response ? { seafarerExists: true } : null;
      })
      .catch(() => {
        return null;
      });
  };
}

function loginNameExistsValidator(httpService: HttpService): AsyncValidatorFn {
  return (control: AbstractControl) => {

    if (!control.value) {
      return of(null);
    }

    return httpService.checkLoginNameUniqueness(control.value)
      .then((response: any) => {
        return response ? { loginExists: true } : null;
      })
      .catch(() => {
        return null;
      });
  };
}
@Component({
  selector: 'app-auth-signup',
  standalone: false,
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss']
})
export default class AuthSignupComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  // data: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      sid: ['', [Validators.required],[seafarerIdExistsValidator(this.httpService)]],
      login: ['', [Validators.required],[loginNameExistsValidator(this.httpService)]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // this.httpService
    //   .request('GET', '/messages', null)
    //   .then((response: any) => {
    //     this.data = response;
    //   });
  }

  get formControl() {
    return this.registerForm?.controls;
  }

  onSubmitRegister() {
    this.submitted = true;
    if (this.registerForm?.valid) {
      this.httpService
        .request('POST', '/register', {
          firstName: this.registerForm.value.firstName,
          lastName: this.registerForm.value.lastName,
          sid: this.registerForm.value.sid,
          login: this.registerForm.value.login,
          password: this.registerForm.value.password
        })
        .then((response: any) => {
          this.httpService.setAuthToken(response.token);
          this.router.navigate(['/auth/signin'], {
            state: { data: {
                action: 'SEND_REGISTER_NOTIFICATION',
                data: response.login
              } 
            } 
          });
        });
    }
  }
}
