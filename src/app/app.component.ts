import { Component, OnInit } from '@angular/core';
const products = require('../products.json');

class Product {
  id: string;
  image: string;
  price: number;
  title: string;
  count: number;
  inCart: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'angular-shopping-cart';
  filteredItems: Product[];
  cartItems: Product[] = [];
  totalCartItems = 0;
  cartTotalPrice = 0;

  ngOnInit() {
    this.getProducts();
    this.getLocalstorage();
  }

  setLocalstorage() {
    if (localStorage.getItem('products') !== null) {
      this.filteredItems = JSON.parse(localStorage.getItem('products'));
    } else {
      localStorage.setItem('products', JSON.stringify(this.filteredItems));
    }
  }

  setLocalstorageCartDetails() {
    const obj = {
      totalCartItems: this.totalCartItems,
      cartTotalPrice: this.cartTotalPrice
    };
    localStorage.setItem('products', JSON.stringify(this.filteredItems));
    localStorage.setItem('carts', JSON.stringify(this.cartItems));
    localStorage.setItem('cartDetails', JSON.stringify(obj));
  }

  getLocalstorage() {
    if (localStorage.getItem('products') !== null && localStorage.getItem('carts') !== null
      && localStorage.getItem('cartDetails') !== null) {
      this.filteredItems = JSON.parse(localStorage.getItem('products'));
      this.cartItems = JSON.parse(localStorage.getItem('carts'));
      const cartDetails = JSON.parse(localStorage.getItem('cartDetails'));
      this.totalCartItems = cartDetails.totalCartItems;
      this.cartTotalPrice = cartDetails.cartTotalPrice;
    }
  }

  getProducts() {
    this.filteredItems = products.map(item => {
      const { id } = item.sys;
      const { title, price } = item.fields;
      const image = item.fields.image.fields.file.url;
      const count = 1;
      const inCart = false;
      return { id, title, price, image, count, inCart };
    });
    this.setLocalstorage();
  }

  updateCart(item) {
    item.inCart = true;
    this.cartItems.push(item);
    this.getCartDetails();
    this.setLocalstorageCartDetails();
  }

  updateCount(type, item) {
    if (type) {
      ++item.count;
    } else {
      --item.count;
      if (item.count <= 0) {
        item.inCart = false;
        this.filteredItems.forEach(filterItem => {
          if (item.id === filterItem.id) {
            filterItem.inCart = false;
          }
        });
        this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
      }
    }
    this.getCartDetails();
    this.setLocalstorageCartDetails();
  }

  getCartDetails() {
    this.totalCartItems = 0;
    let price = 0;
    this.cartItems.forEach(item => {
      this.totalCartItems += item.count;
      price += (item.count * item.price);
    });
    this.cartTotalPrice = price;
  }

  removeCartItem(item) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
    this.getCartDetails();
    this.setLocalstorageCartDetails();
  }

  emptyCart() {
    this.cartItems = [];
    this.cartTotalPrice = 0;
    this.totalCartItems = 0;
    this.filteredItems.forEach(item => {
      item.inCart = false;
    });
    localStorage.clear();
  }
}
