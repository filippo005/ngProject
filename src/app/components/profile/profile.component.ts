import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../auth/auth.service';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  loaded: boolean = false;

  idUser: string;
  userName: string;
  emailUser: string;
  phoneNumber: string;

  constructor(private authService: AuthService, private cookieService: CookieService, private router: Router){}

  ngOnInit(): void {
    setTimeout(() => {
      if(this.cookieService.check('_ssU')){
        const token = this.cookieService.get('_ssU');
        const tokenInfo: any = jwtDecode(token);
        this.idUser = tokenInfo.id;
        this.authService.fetchUserData(this.idUser).subscribe({
          next: (data: any) => {
            this.userName = data.name;
            this.emailUser = data.email;
            this.phoneNumber = data.phoneNumber;
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.loaded = true;
          }
        });
      }
    }, 1000);
  }
}
