import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { UpdateDataService } from '../../../services/update-data.service';

@Component({
  selector: 'app-update-phone-number',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './update-phone-number.component.html',
  styleUrl: './update-phone-number.component.css'
})
export class UpdatePhoneNumberComponent implements OnInit{
  form: FormGroup;

  idUser: string;

  constructor(private updateDataService: UpdateDataService, private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.form = new FormGroup({
      phoneNumber: new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)])
    });

    this.route.paramMap.subscribe(param => {
      this.idUser = param.get('id');
    });
  }

  onSubmit(){
    if(this.form.valid){
      this.updateDataService.updatePhoneNumber(this.form.value.phoneNumber, this.idUser).subscribe({
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          setTimeout(() => {
            this.router.navigate(['/controlSmsOTP', this.idUser]);
          }, 1000);
        }
      });
    }
  }
}
