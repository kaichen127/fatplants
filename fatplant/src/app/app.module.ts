import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TableComponent } from './table/table.component';
import { LmpdArapidopsisComponent } from './lmpd-arapidopsis/lmpd-arapidopsis.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DataAnalysisComponent } from './data-analysis/data-analysis.component';
<<<<<<< HEAD
import { DatatableComponent } from './datatable/datatable.component';
import { GonetworkComponent } from './gonetwork/gonetwork.component';

=======
>>>>>>> parent of 6fc9b69... This adds in datatable component and firebase interaction

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TableComponent,
    LmpdArapidopsisComponent,
    HomepageComponent,
<<<<<<< HEAD
    DataAnalysisComponent,
    DatatableComponent,
    GonetworkComponent
=======
    DataAnalysisComponent
>>>>>>> parent of 6fc9b69... This adds in datatable component and firebase interaction
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
