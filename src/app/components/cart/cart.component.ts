import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

import {MatCardModule} from '@angular/material/card';
import { HomeComponent } from '../home/home.component';

import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';



@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    HomeComponent,
    MatButtonModule,
    RouterLink,
    RouterOutlet,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  items: any;

  price: string;
  idUser: string;

  total: number = 0;
  countItems: number;

  linkPayment: string;

  isPay: boolean = false;
  loaded: boolean = false;

  constructor(private cartService: CartService, private cookieService: CookieService, private router: Router){}

  ngOnInit(): void {
    const token = this.cookieService.get('_ssU');
    const tokenInfo: any = jwtDecode(token);
    this.idUser = tokenInfo.id;

    this.cartService.getItems(this.idUser).subscribe({
      next: (data: any) => {
        if(data.status == 200){
          this.items = data.items;

          this.items.forEach((item: any) => {
            item.quantity = 1;
          });

          this.totalPrice();

          this.countItems = this.items.length;
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.loaded = true;
      }
    });
  }

  removeQuantity(item: any){
    item.quantity = item.quantity - 1;
    this.totalPrice();

    if(item.quantity == 0){
      this.removeItem(item._id, this.idUser);
    }
  }

  addQuantity(item: any){
    item.quantity = item.quantity + 1;
    this.totalPrice();
  }

  removeItem(idItem: string, idUser: string){
    this.cartService.removeItem(idItem, idUser).subscribe({
      next: (data: any) => {
        if(data.status == 200){
          window.location.reload();
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  totalPrice(){
    this.total = 0;
    this.items.forEach((item: any) => {
      this.total += item.price * item.quantity;
    });

    return this.total.toLocaleString('it-IT', {style: 'currency', currency: 'EUR'});
  }

  pay(){
    this.cartService.pay(this.items, this.idUser).subscribe({
      next: (data: any) => {
        console.log(data);
        if(data.status == 200){
          this.isPay = true;
          this.linkPayment = data.url;
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        if(this.isPay){
          window.location.href = this.linkPayment;
        }
      }
    })
  }
}
