import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { HomeComponent } from "../home/home.component";

@Component({
    selector: 'app-product-details',
    standalone: true,
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        HomeComponent
    ]
})
export class ProductDetailsComponent implements OnInit{
  idProduct: string;
  idUser: string;

  product: any;

  isReview: boolean = false;

  formReview: FormGroup;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private cookieService: CookieService,
    private router: Router
    ){}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => {
      this.idProduct = param.get('id');
    });

    const token = this.cookieService.get('_ssU');
    const tokenInfo: any = jwtDecode(token);
    this.idUser = tokenInfo.id;

    this.formReview = new FormGroup({
      mark: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(5)]),
      description: new FormControl(null, Validators.required)
    });

    this.productService.getProduct(this.idProduct).subscribe({
      next: (data: any) => {
        if(data.status == 200){
          this.product = data.product;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  addToCart(): void {
    this.cartService.addItem(this.idProduct, this.idUser).subscribe({
      error: (err) => {
        console.log(err);
      }
    });
  }

  removeItem(){
    this.cartService.removeItem(this.idProduct, this.idUser).subscribe({
      error: (err) => {
        console.log(err);
      }
    });
  }

  submitReview(){
    this.productService.addReview(
      this.formReview.value.mark.trim(),
      this.formReview.value.description.trim(),
      this.idUser,
      this.idProduct).subscribe({
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.router.navigate(["/"]);
        }
      });
  }
}
