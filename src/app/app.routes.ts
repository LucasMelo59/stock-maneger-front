import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { UserComponent } from './pages/user/user.component';
import { ContainerComponent } from './pages/container/container.component';
import { StockComponent } from './pages/stock/stock.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'product', component: ProductComponent },
  { path: 'user', component: UserComponent },
  { path: 'container', component: ContainerComponent },
  { path: 'stock', component: StockComponent },
  { path: '**', redirectTo: 'home' }
];
