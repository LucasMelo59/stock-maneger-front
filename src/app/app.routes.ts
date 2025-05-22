import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductComponent } from './pages/product/product.component';
import { UserComponent } from './pages/user/user.component';
import { ContainerComponent } from './pages/container/container.component';
import { StockComponent } from './pages/stock/stock.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ContainerListComponent } from './pages/container-list/container-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'product', component: ProductComponent },
  { path: 'user', component: UserComponent },
  { path: 'container', component: ContainerComponent },
  { path: 'stock', component: StockComponent },
  { path: 'users', component: UserListComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'containers', component: ContainerListComponent },
  { path: '**', redirectTo: 'home' }
];
