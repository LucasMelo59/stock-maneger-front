import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductService, Category } from '../../services/product.service';
import { CreateProductDTO } from '../../services/home.service';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    RouterModule,
    CardModule,
    ToolbarModule,
    DropdownModule
  ],
  providers: [MessageService],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  productForm!: FormGroup;
  loading = false;
  categoriesLoading = false;
  categories: Category[] = [];

  productTypes = [
    { label: 'Físico', value: '1' },
    { label: 'Digital', value: '2' },
    { label: 'Serviço', value: '3' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadCategories();
  }

  private initForm() {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: [{value: '1', disabled: false}, [Validators.required]],
      sku: ['', [Validators.required]],
      category_id: [null, [Validators.required]]
    });
  }

  loadCategories() {
    this.categoriesLoading = true;
    this.productService.getAllCategories()
      .pipe(finalize(() => this.categoriesLoading = false))
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (error) => {
          console.error('Erro ao carregar categorias:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível carregar a lista de categorias'
          });
        }
      });
  }

  saveProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios'
      });
      return;
    }

    this.loading = true;
    const productData: CreateProductDTO = {
      ...this.productForm.getRawValue(),
      type: '1'
    };

    this.productService.createProduct(productData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto cadastrado com sucesso'
        });
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erro ao cadastrar produto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao cadastrar produto. Tente novamente.'
        });
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
