import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MovementService } from '../../services/movement.service';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { UserService, User } from '../../services/user.service';
import { ProductService, ProductDetail } from '../../services/product.service';
import { ContainerService, ContainerDetail } from '../../services/container.service';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    ToastModule,
    RouterModule,
    CardModule,
    ToolbarModule
  ],
  providers: [MessageService],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent implements OnInit {
  stockForm!: FormGroup;
  loading = false;
  
  eventTypes = [
    { label: 'Entrada', value: 'ENTRADA' },
    { label: 'Saída', value: 'SAIDA' }
  ];

  users: User[] = [];
  products: ProductDetail[] = [];
  containers: ContainerDetail[] = [];
  usersLoading = false;
  productsLoading = false;
  containersLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private movementService: MovementService,
    private userService: UserService,
    private productService: ProductService,
    private containerService: ContainerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  private initForm() {
    this.stockForm = this.formBuilder.group({
      productId: [null, [Validators.required]],
      userId: [null, [Validators.required]],
      containerId: [null, [Validators.required]],
      event: ['', [Validators.required]],
      unitValue: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  loadData() {
    this.usersLoading = true;
    this.productsLoading = true;
    this.containersLoading = true;
    
    forkJoin({
      users: this.userService.getAllUsers(),
      products: this.productService.getAllProducts(),
      containers: this.containerService.getAllContainers()
    }).pipe(
      finalize(() => {
        this.usersLoading = false;
        this.productsLoading = false;
        this.containersLoading = false;
      })
    ).subscribe({
      next: (data) => {
        this.users = data.users;
        this.products = data.products;
        this.containers = data.containers;
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar todos os dados necessários'
        });
      }
    });
  }

  loadUsers() {
    this.usersLoading = true;
    this.userService.getAllUsers()
      .pipe(finalize(() => this.usersLoading = false))
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => {
          console.error('Erro ao carregar usuários:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar a lista de usuários'
          });
        }
      });
  }

  getUserLabel(user: User): string {
    return `${user.name} (${user.typeUser})`;
  }

  getProductLabel(product: ProductDetail): string {
    return `${product.name} (${product.category.description})`;
  }

  getContainerLabel(container: ContainerDetail): string {
    return `${container.name} (${container.type})`;
  }

  saveStock() {
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios'
      });
      return;
    }

    this.loading = true;
    const stockData = this.stockForm.value;

    this.movementService.createMovement(stockData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Movimentação registrada com sucesso'
        });
        this.loading = false;
        // Redirecionar após um breve delay para mostrar a mensagem
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erro ao registrar movimentação:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao registrar movimentação. Tente novamente.'
        });
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
