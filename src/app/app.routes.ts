import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { notAuthGuard } from './auth/not-auth.guard';
import { ControlOTPComponent } from './components/control-otp/control-otp.component';
import { SellProductComponent } from './components/sell-product/sell-product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { PaymentComponent } from './components/payment/payment.component';
import { SuccessPaymentComponent } from './components/success-payment/success-payment.component';

export const routes: Routes = [
     {path: '', component: HomeComponent},
     {path: 'login', component: LoginComponent, canActivate: [notAuthGuard]},
     {path: 'register', component: RegisterComponent, canActivate: [notAuthGuard]},
     {path: 'cart', component: CartComponent, canActivate: [authGuard]},
     {path: "profile", component: ProfileComponent, canActivate: [authGuard]},
     {path: 'resetPassword/:id', component: ResetPasswordComponent},
     {path: 'controlOTP/:id', component: ControlOTPComponent},
     {path: 'productDetails/:id', component: ProductDetailsComponent},
     {path: "sellProduct", component: SellProductComponent},
     {path: 'pay/:total', component: PaymentComponent},
     {path: 'successPayment/:idUser', component: SuccessPaymentComponent}
];