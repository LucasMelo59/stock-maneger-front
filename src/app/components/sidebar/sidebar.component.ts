import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, PanelMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  items: any[] = [];
  visible = input.required<boolean>()
  visibleOutput = output<boolean>()


  ngOnInit() {
    this.items = [
      {
        label: 'Principal',
        icon: 'pi pi-home',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-chart-bar',
            routerLink: ['/dashboard']
          },
          {
            label: 'Visão Geral',
            icon: 'pi pi-eye',
            routerLink: ['/visao-geral']
          }
        ]
      },
      {
        label: 'Gestão',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Usuários',
            icon: 'pi pi-users',
            routerLink: ['/usuarios']
          },
          {
            label: 'Permissões',
            icon: 'pi pi-lock',
            routerLink: ['/permissoes']
          }
        ]
      },
      {
        label: 'Produtos',
        icon: 'pi pi-box',
        items: [
          {
            label: 'Lista de Produtos',
            icon: 'pi pi-list',
            routerLink: ['/produtos']
          },
          {
            label: 'Cadastrar Produto',
            icon: 'pi pi-plus',
            routerLink: ['/produtos/novo']
          },
          {
            label: 'Categorias',
            icon: 'pi pi-tags',
            routerLink: ['/categorias']
          },
          {
            label: 'Fornecedores',
            icon: 'pi pi-truck',
            routerLink: ['/fornecedores']
          }
        ]
      },
      {
        label: 'Relatórios',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Vendas',
            icon: 'pi pi-chart-line',
            routerLink: ['/relatorios/vendas']
          },
          {
            label: 'Estoque',
            icon: 'pi pi-chart-pie',
            routerLink: ['/relatorios/estoque']
          },
          {
            label: 'Financeiro',
            icon: 'pi pi-dollar',
            routerLink: ['/relatorios/financeiro']
          }
        ]
      },
      {
        label: 'Configurações',
        icon: 'pi pi-sliders-h',
        items: [
          {
            label: 'Perfil',
            icon: 'pi pi-user',
            routerLink: ['/perfil']
          },
          {
            label: 'Preferências',
            icon: 'pi pi-cog',
            routerLink: ['/preferencias']
          },
          {
            label: 'Sair',
            icon: 'pi pi-sign-out',
            command: () => {
              // lógica de logout
              console.log('Logout');
            }
          }
        ]
      }
    ];
  }



}