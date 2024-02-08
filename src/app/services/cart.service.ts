import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService{
  items: any = [];

  constructor(){}

  addItem(item: any){
    const result = this.items.indexOf(item);
    if(result == -1){
      this.items = [...this.items, item];
    }
  }

  removeItem(item: any){
    const result = this.items.indexOf(item);

    if(result > -1){
      this.items.splice(result, 1);
    }
  }

  getItems(){
    return this.items;
  }
}
