import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { UpdateDataService } from '../../../services/update-data.service';

@Component({
  selector: 'app-update-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './update-email.component.html',
  styleUrl: './update-email.component.css'
})
export class UpdateEmailComponent implements OnInit{
  form: FormGroup;

  EMAIL_EXISTS: boolean;
  error: boolean;

  idUser: string;

  constructor(private updateDataService: UpdateDataService, private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });

    this.route.paramMap.subscribe(param => {
      this.idUser = param.get('id');
    });
  }

  changeEmailStatus(){
    this.EMAIL_EXISTS = false;
  }

  onSubmit(){
    if(this.form.valid){
      this.updateDataService.updateEmail(this.idUser, this.form.value.email).subscribe({
        next: (data: any) => {
          if(data.status == 200){
            this.EMAIL_EXISTS = false;
          }
          else{
            this.form.reset();
            this.EMAIL_EXISTS = true;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          if(this.EMAIL_EXISTS === false){
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 1000);
          }
        }
      });
    }
  }
}
