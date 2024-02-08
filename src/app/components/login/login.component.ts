import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    RouterOutlet,
    RouterLink
  ],
  providers: [CookieService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  dataNotValid: string;
  hide = true;

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService){}

  ngOnInit(): void {
      this.loginForm = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, Validators.required)
      });
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.authService.login(
        this.loginForm.value.email.trim(),
        this.loginForm.value.password.trim()
      ).subscribe({
        next: (data: any) => {
          if(data.status == 200){
            this.authService.createUser(data.name, data.email);
            this.cookieService.set('_ssU', data.token, {
              path: "/",
              expires: new Date(new Date().getTime() + 3600 * 1000)
            });
          }
          else{
            this.loginForm.reset();
            this.dataNotValid = "Email or Password not valid";
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.router.navigate(['']);
        }
      })
    }
  }
}
