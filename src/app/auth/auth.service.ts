import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = "https://ng-project.vercel.app/api";

  constructor(private http: HttpClient){}

  register(name: string, email: string, password: string){
    const values = {
      name: name,
      email: email,
      password: password
    };

    return this.http.post(`${this.url}/register`, values);
  }

  login(email: string, password: string){
    const values = {
      email: email,
      password: password
    };

    return this.http.post(`${this.url}/login`, values, {withCredentials: true});
  }

  fetchUserData(id: string){
    return this.http.get(`${this.url}/data/${id}`);
  }

  sendEmail(email: string){
    const values = {
      email: email
    }

    return this.http.post(`${this.url}/sendEmail`, values)
  }

  controlOTP(id: string, otp: number){
    const values = {
      id: id,
      otp: otp
    };

    return this.http.post(`${this.url}/controlOTP`, values);
  }

  verifySmsOTP(idUser: string, code: string){
    const data = {
      idUser: idUser,
      code: code
    };

    return this.http.post(`${this.url}/verifySmsOTP`, data);
  }
}
