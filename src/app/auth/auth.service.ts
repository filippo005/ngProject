import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/userModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = "http://localhost:8080/api";

  user: User;

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

  logout(){
    return this.http.get(`${this.url}/logout`);
  }

  createUser(name: string, email: string){
    this.user = new User(name, email);
  }

  fetchUserData(email: string){
    const values = {
      email: email
    }
    return this.http.post(`${this.url}/data`, values);
  }


}
