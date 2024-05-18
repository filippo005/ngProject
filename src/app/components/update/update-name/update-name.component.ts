import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { UpdateDataService } from '../../../services/update-data.service';

@Component({
  selector: 'app-update-name',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './update-name.component.html',
  styleUrl: './update-name.component.css'
})
export class UpdateNameComponent implements OnInit{
  form: FormGroup;

  idUser: string;

  constructor(private updateDataService: UpdateDataService, private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.route.paramMap.subscribe(param => {
      this.idUser = param.get('id');
    });
  }

  onSubmit(){
    if(this.form.valid){
      this.updateDataService.updateName(this.idUser, this.form.value.name).subscribe({
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1000);
        }
      });
    }
  }
}
