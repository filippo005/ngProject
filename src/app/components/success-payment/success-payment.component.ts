import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success-payment',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './success-payment.component.html',
  styleUrl: './success-payment.component.css'
})
export class SuccessPaymentComponent implements OnInit{
  idUser: string;
  message: string;

  constructor(private cartService: CartService, private activatedRoute: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => {
      this.idUser = param.get('idUser');
    });

    this.cartService.emptyCart(this.idUser).subscribe({
      next: (data: any) => {
        if(data.status == 200){
          this.message = "Pagamento effettuato con successo";
        }
        else{
          console.log(data.error);
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      }
    })
  }
}
