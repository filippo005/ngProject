import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{
  total: any;

  constructor(private activatdRouter: ActivatedRoute, private cartService: CartService){}

  ngOnInit(): void {
    this.activatdRouter.paramMap.subscribe(param => {
      this.total = param.get('total');
    });
  }

  // pay(){
  //   this.cartService.pay(this.total).subscribe({
  //     next: (data) => {
  //       console.log(data);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   });
  // }
}
