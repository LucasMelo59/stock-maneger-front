import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { CreateUserDTO } from '../../services/home.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    RouterModule,
    CardModule,
    ToolbarModule
  ],
  providers: [MessageService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  loading = false;

  userTypes = [
    { label: 'Pessoa Física', value: 'PF' },
    { label: 'Pessoa Jurídica', value: 'PJ' }
  ];

  documentTypes = [
    { label: 'RG', value: 'PF' },
    { label: 'CNPJ', value: 'PJ' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      documentation: this.formBuilder.array([])
    });

    // Adiciona um documento inicial
    this.addDocument();
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

  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios'
      });
      return;
    }

    this.loading = true;
    const userData: CreateUserDTO = this.userForm.value;

    this.userService.createUser(userData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário cadastrado com sucesso'
        });
        this.loading = false;
        // Redirecionar após um breve delay para mostrar a mensagem
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erro ao cadastrar usuário:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao cadastrar usuário. Tente novamente.'
        });
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
