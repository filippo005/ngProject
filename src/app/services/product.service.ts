import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = "http://localhost:8080/api";

  constructor(private http: HttpClient){}

  registerProduct(data: any){
    return this.http.post(`${this.url}/registerProduct`, data);
  }

  getProducts(){
    return this.http.get(`${this.url}/getProducts`);
  }
}
