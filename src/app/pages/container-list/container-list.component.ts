import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ContainerService, ContainerDetail } from '../../services/container.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-container-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    CardModule
  ],
  providers: [MessageService],
  templateUrl: './container-list.component.html',
  styleUrl: './container-list.component.scss'
})
export class ContainerListComponent implements OnInit {
  containers: ContainerDetail[] = [];
  loading = false;
  
  constructor(
    private containerService: ContainerService,
    private messageService: MessageService
  ) {}
  
  ngOnInit() {
    this.loadContainers();
  }
  
  loadContainers() {
    this.loading = true;
    this.containerService.getAllContainers()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.containers = data;
        },
        error: (error) => {
          console.error('Erro ao carregar containers:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar a lista de containers'
          });
        }
      });
  }
  
  getContainerType(type: string): string {
    switch(type) {
      case 'DRY': return 'Seco';
      case 'HIGH_CUBE': return 'High Cube';
      case 'REFRIGERATED': return 'Refrigerado';
      default: return type;
    }
  }
} 