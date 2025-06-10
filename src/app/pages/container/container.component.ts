import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ContainerService } from '../../services/container.service';
import { CreateContainerDTO } from '../../services/home.service';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ContainerType } from './interfaces/container-type';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    ToastModule,
    RouterModule,
    CardModule,
    ToolbarModule
  ],
  providers: [MessageService],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class ContainerComponent implements OnInit {
  containerForm!: FormGroup;
  loading = false;
  containerTypes = Object.values(ContainerType);

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private containerService: ContainerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.containerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
  }

  saveContainer() {
    if (this.containerForm.invalid) {
      this.containerForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios'
      });
      return;
    }

    this.loading = true;
    const containerData: CreateContainerDTO = this.containerForm.value;

    this.containerService.createContainer(containerData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Container cadastrado com sucesso'
        });
        this.loading = false;
        // Redirecionar após um breve delay para mostrar a mensagem
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erro ao cadastrar container:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao cadastrar container. Tente novamente.'
        });
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
