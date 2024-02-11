import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  hide = true;
  EMAIL_EXISTS: boolean;
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router){}

  ngOnInit(): void {
      this.registerForm = new FormGroup({
        name: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(8)])
      });
  }

  changeEmailStatus(){
    this.EMAIL_EXISTS = false;
  }

  onSubmit(){
    if(this.registerForm.valid){
      this.authService.register(
        this.registerForm.value.name.trim(),
        this.registerForm.value.email.trim(),
        this.registerForm.value.password.trim()
      ).subscribe({
        next: (data: any) => {
          if(data.status == 400){
            this.registerForm.reset();
            this.EMAIL_EXISTS = true;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          if(this.EMAIL_EXISTS == false){
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }
}
