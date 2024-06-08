import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = "http://localhost:8080/api";

  constructor(private http: HttpClient){}

  registerProduct(name: string, price: string, category: any, file: File){
    //se ho un file, devo usare un FormData
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('file', file);

    return this.http.post(`${this.url}/registerProduct`, formData);
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
