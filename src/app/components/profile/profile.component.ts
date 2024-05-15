import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../auth/auth.service';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  loaded: boolean = false;
  formName: boolean = false;
  formEmail: boolean = false;
  EMAIL_EXISTS: boolean;
  errors: boolean;

  idUser: string;
  userName: string;
  emailUser: string;

  nameForm: FormGroup;
  emailForm: FormGroup;

  data: string;
  cod: number;

  constructor(private authService: AuthService, private cookieService: CookieService, private router: Router){}

  ngOnInit(): void {
    setTimeout(() => {
      if(this.cookieService.check('_ssU')){
        const token = this.cookieService.get('_ssU');
        const tokenInfo: any = jwtDecode(token);
        this.idUser = tokenInfo.id;
        this.authService.fetchUserData(this.idUser).subscribe({
          next: (data: any) => {
            this.userName = data.name;
            this.emailUser = data.email;
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.loaded = true;
          }
        });
      }
    }, 1000);

    this.nameForm = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.emailForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  updateName(){
    this.formName = true;
  }

  updateEmail(){
    this.formEmail = true;
  }

  closeForms(){
    this.formEmail = false;
    this.formName = false;
  }

  changeEmailStatus(){
    this.EMAIL_EXISTS = false;
  }

  onSubmit(){
    if(this.formName){
      this.data = this.nameForm.value.name.trim();
      this.cod = 0;
    }
    else{
      this.data = this.emailForm.value.email.trim();
      this.cod = 1;
    }

    this.authService.updateData(this.idUser, this.data, this.cod).subscribe({
      next: (data: any) => {
        if(data.status == 200){
          this.EMAIL_EXISTS = false;
          this.errors = false;
        }
        else{
          this.nameForm.reset();
          this.emailForm.reset();
          this.EMAIL_EXISTS = true;
          this.errors = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        if(this.EMAIL_EXISTS == false && this.errors == false){
          window.location.reload();
        }
      }
    })
  }
}
