import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.apiUrl}/stock`;

  getProducts(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all/${id}`);
  }
} 