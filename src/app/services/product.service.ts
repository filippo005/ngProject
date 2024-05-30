import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = "https://ng-project.vercel.app/api";

  constructor(private http: HttpClient){}

  registerProduct(name: string, price: number, category: any){
    const data = {
      name: name,
      price: price,
      category: category
    }

    return this.http.post(`${this.url}/registerProduct`, data);
  }

  getProducts(){
    return this.http.get(`${this.url}/getProducts`);
  }

  getProduct(idProduct: string){
    return this.http.get(`${this.url}/getProduct/${idProduct}`);
  }

  addReview(mark: number, description: string, idUser: string, idProduct: string){
    const data = {
      mark: mark,
      description: description,
      idUser: idUser,
      idProduct: idProduct
    }

    return this.http.post(`${this.url}/addReview`, data);
  }
}
