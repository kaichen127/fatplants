import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LmpdArapidopsisComponent } from './lmpd-arapidopsis/lmpd-arapidopsis.component';


const routes: Routes = [{path:'lmpd_arapidopsis',component:LmpdArapidopsisComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
