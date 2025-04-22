import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Product, ProductService } from '../../services/product.service';
import { RouterModule } from '@angular/router';
import { HomeService } from '../../services/home.service';


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
    InputNumberModule,
    DropdownModule,
    ToastModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  displayModal: boolean = false;
  editingProduct: boolean = false;
  productForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  categories = [
    { label: 'Eletrônicos', value: 'electronics' },
    { label: 'Roupas', value: 'clothing' },
    { label: 'Alimentos', value: 'food' },
    { label: 'Livros', value: 'books' }
  ];

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private homeService: HomeService
  ) {
    this.productForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.homeService.getProducts(1).subscribe(x => {
      console.log(x);
    })
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
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

  showModal(product?: Product) {
    this.editingProduct = !!product;
    if (product) {
      this.productForm.patchValue(product);
    } else {
      this.productForm.reset();
    }
    this.submitted = false;
    this.displayModal = true;
  }

  hideModal() {
    this.displayModal = false;
    this.submitted = false;
    this.productForm.reset();
  }

  deleteProduct(product: Product) {
    if (product.id) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto excluído com sucesso'
          });
          this.loadProducts();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao excluir produto'
          });
        }
      });
    }
  }

  saveProduct() {
    this.submitted = true;

    if (this.productForm.valid) {
      const product = this.productForm.value;
      
      if (product.id) {
        this.productService.updateProduct(product.id, product).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto atualizado com sucesso'
            });
            this.hideModal();
            this.loadProducts();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao atualizar produto'
            });
          }
        });
      } else {
        this.productService.createProduct(product).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto criado com sucesso'
            });
            this.hideModal();
            this.loadProducts();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto'
            });
          }
        });
      }
    }
  }

  getCategoryLabel(value: string): string {
    const category = this.categories.find(c => c.value === value);
    return category ? category.label : value;
  }
}
