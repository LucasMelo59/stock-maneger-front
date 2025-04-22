import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TemplateHomeComponent } from './template/template-home/template-home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TemplateHomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'stock-manager-front';
}
