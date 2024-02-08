import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  userName: string;

  constructor(private cookieService: CookieService){}

  ngOnInit(): void {
    if(this.cookieService.check('_ssU')){
      const token = this.cookieService.get('_ssU');
      const tokenInfo: any = jwtDecode(token);
      console.log(tokenInfo);
      this.userName = tokenInfo.name;
    }
  }
}
