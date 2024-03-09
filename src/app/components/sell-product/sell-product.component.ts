import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import {MatSelectModule} from '@angular/material/select';

import categoriesList from '../../../categories.json';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sell-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './sell-product.component.html',
  styleUrl: './sell-product.component.css'
})
export class SellProductComponent implements OnInit{
  form: FormGroup;

  categories: any;

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required)
    });

    categoriesList.categories.sort((a: any, b: any) => {
      if(a.value < b.value) return -1;
      if(a.value > b.value) return 1;
      return 0;
    });

    this.categories = categoriesList.categories;
  }

  onSubmit(){
    if(this.form.valid){
      const data = {
        name: this.form.value.name.trim(),
        price: this.form.value.price.trim(),
        category: this.form.value.category
      };

      this.productService.registerProduct(data).subscribe({
        next: (data: any) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {

        }
      });
    }
  }
}
