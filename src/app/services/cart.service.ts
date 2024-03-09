import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService{
  url = "http://localhost:8080/api/cart";

  constructor(private http: HttpClient){}

  addItem(idItem: string, id: string){
    const data = {
      idItem: idItem,
      idUser: id
    }

    return this.http.post(`${this.url}/addItem`, data);
  }

  removeItem(idItem: string, idUser: string){
    const data = {
      idUser: idUser,
      idItem: idItem
    }

    return this.http.post(`${this.url}/removeItem`, data);
  }

  getItems(idUser: string){
    return this.http.get(`${this.url}/getItems/${idUser}`);
  }
}
