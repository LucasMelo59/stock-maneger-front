import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  private apiUrl = `${environment.apiUrl}/containers`;

  constructor(private http: HttpClient) {}

  getContainers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createContainer(container: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, container);
  }
} 