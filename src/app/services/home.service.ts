import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  description: string;
}

export interface ProductInfo {
  id: number;
  name: string;
  type: string;
  createAt: string;
  updateAt: string;
  active: boolean;
  sku: string;
  category: Category;
}

export interface Documentation {
  type: string;
  description: string;
  reference_number: string;
  issue_date: string;
  issuing_body: string;
}

export interface User {
  id: number;
  name: string;
  createAt: string;
  updateAt: string;
  typeUser: string;
  active: boolean;
}

export interface ContainerProduct {
  id: number;
  name: string;
  description: string;
  location: string;
  type: string;
  active: boolean;
  createAt: string;
  updateAt: string;
}

export interface StockEvent {
  id: number;
  quantity: number;
  unitValue: number;
  createAt: string;
  product: ProductInfo;
  typeEvent: string;
  user: User;
  containerProduct: ContainerProduct;
}

export interface CreateProductDTO {
  name: string;
  type: string;
  sku: string;
  category_id: number;
}

export interface CreateUserDTO {
  name: string;
  type: string;
  documentation: Documentation[];
}

export interface CreateContainerDTO {
  name: string;
  description: string;
  location: string;
  type: string;
}

export interface CreateStockFlowDTO {
  productId: number;
  userId: number;
  containerId: number;
  event: string;
  unitValue: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  getProducts(id: number): Observable<StockEvent[]> {
    return this.http.get<StockEvent[]>(`${this.apiUrl}/stock/all/${id}`);
  }

  registerProduct(product: CreateProductDTO): Observable<ProductInfo> {
    return this.http.post<ProductInfo>(`${this.apiUrl}/product`, product);
  }

  registerUser(user: CreateUserDTO): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user`, user);
  }

  registerContainer(container: CreateContainerDTO): Observable<ContainerProduct> {
    return this.http.post<ContainerProduct>(`${this.apiUrl}/container/product`, container);
  }

  registerStockFlow(stockFlow: CreateStockFlowDTO): Observable<StockEvent> {
    return this.http.post<StockEvent>(`${this.apiUrl}/stock`, stockFlow);
  }
} 