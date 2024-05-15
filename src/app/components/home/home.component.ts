import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {jwtDecode} from 'jwt-decode';
import {MatBadgeModule} from '@angular/material/badge';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import categoriesList from '../../../categories.json';


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
    MatBadgeModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  sideNavOpen: boolean = false;
  inputFocus: boolean = false;
  loaded: boolean = false;
  isReview: boolean = false;

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('category') category: ElementRef<HTMLSelectElement>;

  idUser: string;
  idProduct: string;
  userName: string;
  viewDiv: string;

  beforeProducts: any;
  products: any;
  filteredProducts: any;
  filteredItems: any;
  categories: any;

  countCartItems: number = 0;

  formReview: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private cartService: CartService,
    private productService: ProductService
    ){}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        if(data.status == 200){
          this.products = data.products;
        }
        else{
          console.log("Non ci sono prodotti");
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.filteredProducts = this.products;
      }
    });

    setTimeout(() => {
      if(this.cookieService.check('_ssU')){
        const token = this.cookieService.get('_ssU');
        const tokenInfo: any = jwtDecode(token);
        this.idUser = tokenInfo.id;
        this.authService.fetchUserData(this.idUser).subscribe({
          next: (data: any) => {
            this.userName = data.name;
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.cartService.getItems(this.idUser).subscribe({
            next: (data: any) => {
              if(data.status == 200){
                this.countCartItems = data.items.length;
              }
            },
            error: (err) => {
              console.log(err);
            }
          })
          }
        });
      }

      this.loaded = true;
    }, 1000);

    categoriesList.categories.sort((a:any, b:any) => {
      if(a.value < b.value) return -1;
      if(a.value > b.value) return 1;
      return 0;
    });

    this.categories = categoriesList.categories;
  }

  openSideNav(): void{
    this.sideNavOpen = !this.sideNavOpen;
  }

  searchItems():void {
    this.filteredProducts = this.products.filter((item: any) => {
      if(this.category.nativeElement.value == "Tutte le categorie"){
        return item.name.toLowerCase().includes(this.searchInput.nativeElement.value.toLowerCase());
      }
      else{
        return item.name.toLowerCase().includes(this.searchInput.nativeElement.value.toLowerCase()) &&
        item.category == this.category.nativeElement.value;
      }
    });
    this.searchInput.nativeElement.value = "";
    this.inputFocus = false;
  }

  filterItems():void {
    this.inputFocus = true;
    this.filteredItems = this.products.filter((item: any) => {
      return item.name.toLowerCase().includes(this.searchInput.nativeElement.value.toLowerCase());
    });
  }

  //@HostListener('document:click) => sta in ascolto di tutti i click che avvengono in tutto il documento
  @HostListener('document:click', ['$event'])
  onClick(event: any){
    const form = document.getElementById('form');

    if(form && !form.contains(event.target)){
      this.inputFocus = false;
    }
  }

  searchFilter(name: string){
    this.filteredProducts = this.products.filter((item: any) => {
      if(this.category.nativeElement.value == "Tutte le categorie"){
        return item.name.toLowerCase().includes(name.toLowerCase());
      }
      else{
        return item.name.toLowerCase().includes(name.toLowerCase()) &&
        item.category == this.category.nativeElement.value;
      }
    });
    this.searchInput.nativeElement.value = "";
    this.inputFocus = false;
  }

  onLogout(){
    this.cookieService.delete('_ssU');
    this.router.navigate(['/login']);
  }

  verifyNumber(){
    this.authService.verifyPhoneNumber().subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
