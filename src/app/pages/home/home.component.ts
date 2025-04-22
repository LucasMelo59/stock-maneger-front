import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { HomeService, StockEvent, CreateProductDTO, CreateUserDTO, CreateContainerDTO } from '../../services/home.service';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { ContainerService } from '../../services/container.service';
import { MovementService } from '../../services/movement.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextarea,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    ToolbarModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stockEvents: StockEvent[] = [];
  loading: boolean = false;

  // Modais
  displayProductModal: boolean = false;
  displayUserModal: boolean = false;
  displayContainerModal: boolean = false;
  displayStockModal: boolean = false;

  // Formulários
  productForm!: FormGroup;
  userForm!: FormGroup;
  containerForm!: FormGroup;
  stockForm!: FormGroup;

  // Opções para dropdowns
  userTypes = [
    { label: 'Pessoa Física', value: 'PF' },
    { label: 'Pessoa Jurídica', value: 'PJ' }
  ];

  documentTypes = [
    { label: 'RG', value: 'PF' },
    { label: 'CNPJ', value: 'PJ' }
  ];

  eventTypes = [
    { label: 'Entrada', value: 'ENTRADA' },
    { label: 'Saída', value: 'SAIDA' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private homeService: HomeService,
    private productService: ProductService,
    private userService: UserService,
    private containerService: ContainerService,
    private stockService: MovementService,
    private movementService: MovementService
  ) {
    this.initializeForms();

    this.stockForm = this.formBuilder.group({
      productId: ['', Validators.required],
      userId: ['', Validators.required],
      containerId: ['', Validators.required],
      event: ['', Validators.required],
      unitValue: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  private initializeForms() {
    // Formulário de Produto
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      category_id: [null, [Validators.required]]
    });

    // Formulário de Usuário
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      documentation: this.formBuilder.array([])
    });

    // Formulário de Container
    this.containerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });

    // Adiciona um documento inicial
    this.addDocument();

    // Formulário de Stock
    this.stockForm = this.formBuilder.group({
      productId: ['', Validators.required],
      userId: ['', Validators.required],
      containerId: ['', Validators.required],
      event: ['', Validators.required],
      unitValue: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  // Métodos para o FormArray de documentação
  get documentationArray() {
    return this.userForm.get('documentation') as FormArray;
  }

  get documentationControls() {
    return this.documentationArray.controls;
  }

  createDocumentFormGroup() {
    return this.formBuilder.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
      reference_number: ['', Validators.required],
      issue_date: [null, Validators.required],
      issuing_body: ['', Validators.required]
    });
  }

  addDocument() {
    this.documentationArray.push(this.createDocumentFormGroup());
  }

  removeDocument(index: number) {
    this.documentationArray.removeAt(index);
  }

  // Métodos de carregamento
  loadProducts() {
    this.loading = true;
    this.homeService.getProducts(1).subscribe({
      next: (data) => {
        this.stockEvents = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar produtos'
        });
        this.loading = false;
      }
    });
  }

  // Métodos para exibir/ocultar modais
  showProductModal() {
    this.productForm.reset();
    this.displayProductModal = true;
  }

  hideProductModal() {
    this.displayProductModal = false;
    this.productForm.reset();
  }

  showUserModal() {
    this.userForm.reset();
    this.documentationArray.clear();
    this.addDocument();
    this.displayUserModal = true;
  }

  hideUserModal() {
    this.displayUserModal = false;
    this.userForm.reset();
  }

  showContainerModal() {
    this.containerForm.reset();
    this.displayContainerModal = true;
  }

  hideContainerModal() {
    this.displayContainerModal = false;
    this.containerForm.reset();
  }

  showStockModal() {
    this.stockForm.reset();
    this.displayStockModal = true;
  }

  hideStockModal() {
    this.displayStockModal = false;
    this.stockForm.reset();
  }

  // Métodos para salvar
  saveProduct() {
    if (this.productForm.valid) {
      const product: CreateProductDTO = this.productForm.value;
      this.homeService.registerProduct(product).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto cadastrado com sucesso'
          });
          this.hideProductModal();
          this.loadProducts();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao cadastrar produto'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios'
      });
    }
  }

  saveUser() {
    if (this.userForm.valid) {
      const user: CreateUserDTO = this.userForm.value;
      this.homeService.registerUser(user).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário cadastrado com sucesso'
          });
          this.hideUserModal();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao cadastrar usuário'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios'
      });
    }
  }

  saveContainer() {
    if (this.containerForm.valid) {
      const container: CreateContainerDTO = this.containerForm.value;
      this.homeService.registerContainer(container).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Container cadastrado com sucesso'
          });
          this.hideContainerModal();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao cadastrar container'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios'
      });
    }
  }

  saveStock() {
    if (this.stockForm.valid) {
      const stockData = this.stockForm.value;
      this.movementService.createMovement(stockData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Movimentação criada com sucesso'
          });
          this.hideStockModal();
          this.refreshData();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar movimentação'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios'
      });
    }
  }

  refreshData() {
    this.loadProducts();
    // this.loadUsers();
    // this.loadContainers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        // Implementar lógica para atualizar lista de usuários
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar usuários'
        });
      }
    });
  }

  loadContainers() {
    this.containerService.getContainers().subscribe({
      next: (data) => {
        // Implementar lógica para atualizar lista de containers
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar containers'
        });
      }
    });
  }
}
