import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UpdateDataService {

  url = "https://ng-project.vercel.app/api";

  constructor(private http: HttpClient){}

  updateName(idUser: string, name: string){
    const values = {
      idUser: idUser,
      name: name
    };

    return this.http.post(`${this.url}/updateName`, values);
  }

  updateEmail(idUser: string, email: string){
    const values = {
      idUser: idUser,
      email: email
    };

    return this.http.post(`${this.url}/updateEmail`, values);
  }

  updatePhoneNumber(phoneNumber: string, idUser: string){
    const data = {
      prefix: "+39",
      phoneNumber: phoneNumber,
      idUser: idUser
    };

    return this.http.post(`${this.url}/updatePhoneNumber`, data);
  }

  updatePassword(id: string, password: string){
    const values = {
      id: id,
      password: password
    }

    return this.http.post(`${this.url}/resetPassword`, values);
  }
}
