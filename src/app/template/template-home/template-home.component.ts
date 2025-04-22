import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { TopbarComponent } from "../../components/topbar/topbar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-home',
  imports: [RouterModule, HeaderComponent, SidebarComponent, TopbarComponent, CommonModule],
  templateUrl: './template-home.component.html',
  styleUrl: './template-home.component.scss',
  standalone: true
})
export class TemplateHomeComponent {
  
  toggleSidebar() {
    const sidebar = document.querySelector('.layout-sidebar');
    sidebar?.classList.toggle('active');
  }

}
