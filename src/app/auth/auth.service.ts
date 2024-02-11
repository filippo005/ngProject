import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = "http://localhost:8080/api";

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

  updateData(id: string, data: string, typeData: number){
    const values = {
      id: id,
      data: data
    }

    if(typeData == 0){
      return this.http.post(`${this.url}/updateName`, values);
    }
    else{
      return this.http.post(`${this.url}/updateEmail`, values);
    }
  }
}
