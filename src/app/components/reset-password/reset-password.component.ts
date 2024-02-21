import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{
  form: FormGroup;

  hide: boolean = true;
  updatePassword: boolean;

  id: string;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.form = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });

    //fetch the id from the url
    this.route.paramMap.subscribe(param => {
      this.id = param.get('id');
    });
  }

  onSubmit(){
    this.authService.updatePassword(this.id, this.form.value.password.trim()).subscribe({
      next: (data: any) => {
        if(data.status == 500){
          this.form.reset();
          this.updatePassword = false;
        }
        else if(data.status == 200){
          this.updatePassword = true;
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        if(this.updatePassword){
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        }
      }
    })
  }
}
