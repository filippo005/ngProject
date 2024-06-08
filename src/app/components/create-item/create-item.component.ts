import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';

import { ProductService } from '../../services/product.service';

import categoriesList from '../../../categories.json';

@Component({
  selector: 'app-create-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './create-item.component.html',
  styleUrl: './create-item.component.css'
})
export class CreateItemComponent implements OnInit{
  form: FormGroup;

  file: File = null;

  categories: any;

  successfull: boolean;

  constructor(private productService: ProductService, private router: Router){}

  ngOnInit(): void {
      this.form = new FormGroup({
        name: new FormControl(null, Validators.required),
        price: new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1, 2})?$/)]),
        category: new FormControl(null, Validators.required)
      });

      categoriesList.categories.sort((a:any, b:any) => {
        if(a.value < b.value) return -1;
        if(a.value > b.value) return 1;
        return 0;
      });

      this.categories = categoriesList.categories;
  }

  onChangeFile(e: any){
    this.file = e.target.files[0];
  }

  onSubmit(){
    if(this.form.valid){
      this.productService.registerProduct(
        this.form.value.name.trim(),
        this.form.value.price.trim(),
        this.form.value.category,
        this.file
      ).subscribe({
        next: (data: any) => {
          if(data.status === 200){
            this.successfull = true;
          }
          else{
            this.successfull = false;
          }
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          if(this.successfull){
            this.router.navigate(['/']);
          }
        }
      });
    }
  }
}
