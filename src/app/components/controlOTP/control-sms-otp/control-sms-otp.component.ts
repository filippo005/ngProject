import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-control-sms-otp',
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
  templateUrl: './control-sms-otp.component.html',
  styleUrl: './control-sms-otp.component.css'
})
export class ControlSmsOtpComponent implements OnInit{
  form: FormGroup;

  userId: string;

  rigthOTP: boolean = false;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
      this.form = new FormGroup({
        otp: new FormControl(null, [Validators.required,Validators.minLength(6)])
      });

      this.route.paramMap.subscribe(param => {
        this.userId = param.get("id");
      });
  }

  onSubmit(){
    this.authService.verifySmsOTP(this.userId, this.form.value.otp).subscribe({
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
            this.router.navigate(['/profile']);
          }, 1000);
        }
      }
    });
  }

}
