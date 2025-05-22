import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContainerDetail {
  id: number;
  name: string;
  description: string;
  location: string;
  type: string;
  active: boolean;
  createAt: string;
  updateAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  private apiUrl = `${environment.apiUrl}/container/product`;

  constructor(private http: HttpClient) {}

  getContainers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAllContainers(): Observable<ContainerDetail[]> {
    return this.http.get<ContainerDetail[]>(`${this.apiUrl}`);
  }

  createContainer(container: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, container);
  }
} 