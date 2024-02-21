import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-control-otp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './control-otp.component.html',
  styleUrl: './control-otp.component.css'
})
export class ControlOTPComponent implements OnInit{
  form: FormGroup;

  rigthOTP: boolean;

  userId: string;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.form = new FormGroup({
      otp: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });

    this.route.paramMap.subscribe(param => {
      this.userId = param.get("id");
    });
  }

  onSubmit(){
    this.authService.controlOTP(this.userId, this.form.value.otp).subscribe({
      next: (data: any) => {
        if(data.status == 400){
          this.form.reset();
          this.rigthOTP = false;
        }
        else{
          this.rigthOTP = true;
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        if(this.rigthOTP){
          setTimeout(() => {
            this.router.navigate([`/resetPassword/${this.userId}`]);
          }, 1000);
        }
      }
    });
  }
}
