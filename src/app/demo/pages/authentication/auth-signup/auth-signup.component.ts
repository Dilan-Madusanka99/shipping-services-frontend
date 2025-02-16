import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

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
      login: ['', [Validators.required]],
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
          login: this.registerForm.value.login,
          password: this.registerForm.value.password
        })
        .then((response: any) => {
          this.httpService.setAuthToken(response.token);
          this.router.navigate(['/auth/signup']);
        });
    }
  }
}
