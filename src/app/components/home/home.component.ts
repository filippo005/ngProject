import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {jwtDecode} from 'jwt-decode';
import {MatBadgeModule} from '@angular/material/badge';

import productsData from '../../../products.json';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    RouterLink,
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatBadgeModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  sideNavOpen: boolean = false;
  inputFocus: boolean = false;

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('category') category: ElementRef<HTMLSelectElement>;

  userEmail: string;
  userName: string;
  viewDiv: string;

  products: any;
  filteredProducts: any;
  filteredItems: any;

  countCartItems: number = this.cartService.items.length;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private cartService: CartService
    ){}

  ngOnInit(): void {
    if(this.cookieService.check('_ssU')){
      const token = this.cookieService.get('_ssU');
      const tokenInfo: any = jwtDecode(token);
      this.userEmail = tokenInfo.email;

      this.authService.fetchUserData(this.userEmail).subscribe({
        next: (data: any) => {
          this.userName = data.name;
          console.log(this.userName);
        },
        error: (err) => {
            console.log(err);
        }
      })
    }

    this.products = productsData.products;
    this.filteredProducts = this.products;
  }

  openSideNav(): void{
    this.sideNavOpen = !this.sideNavOpen;
  }

  searchItems(){
    this.filteredProducts = this.products.filter((item: any) => {
      if(this.category.nativeElement.value == "Tutte le categorie"){
        return item.title.toLowerCase().includes(this.searchInput.nativeElement.value.toLowerCase());
      }
      else{
        return item.title.toLowerCase().includes(this.searchInput.nativeElement.value.toLowerCase()) &&
        item.category == this.category.nativeElement.value;
      }
    });
    this.searchInput.nativeElement.value = "";
  }

  filterItems(){
    this.inputFocus = true;
    this.filteredItems = this.products.filter((item: any) => {
      return item.title.toLowerCase().includes(this.searchInput.nativeElement.value.toLowerCase());
    });
  }

  inputBlur(){
    this.inputFocus = false;
  }

  addToCart(item: {}){
    this.cartService.addItem(item);
    this.countCartItems = this.cartService.items.length;
  }

  removeFromCart(item: {}){
    this.cartService.removeItem(item);
    this.countCartItems = this.cartService.items.length;
  }

  onLogout(){
    this.authService.logout().subscribe({
      next: (data: any) => {
        if(data.status == 200){
          this.authService.user = null;
          this.cookieService.delete('_ssU');
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.router.navigate(['/login']);
      }
    })
  }
}
