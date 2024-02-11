import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
     {path: '', component: HomeComponent},
     {path: 'login', component: LoginComponent},
     {path: 'register', component: RegisterComponent},
     {path: 'cart', component: CartComponent, canActivate: [authGuard]},
     {path: "profile", component: ProfileComponent, canActivate: [authGuard]},
];