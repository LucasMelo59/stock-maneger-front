import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateProductDTO } from './home.service';

export interface Product {
  id?: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  type?: string;
  sku?: string;
  category_id?: number;
}

export interface ProductDetail {
  id: number;
  name: string;
  type: string;
  createAt: string;
  updateAt: string;
  active: boolean;
  sku: string;
  category: {
    id: number;
    description: string;
  };
}

export interface Category {
  id: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getAllProducts(): Observable<ProductDetail[]> {
    return this.http.get<ProductDetail[]>(`${this.apiUrl}`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/all/category`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: CreateProductDTO): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 