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
import { DatatableComponent } from './datatable/datatable.component';
import { MatTableModule } from '@angular/material'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule} from '@angular/material/menu';
import {CdkTableModule} from '@angular/cdk/table';


// import { CytodemoComponent } from './cytodemo/cytodemo.component';
import { CytoscapeModule } from 'ngx-cytoscape';
import { GoNetworkComponent } from './go-network/go-network.component';
// import { GraphComponent } from './go-network/graph/graph.component';
// import {NgCytoComponent} from './go-network/ng-cyto/ng-cyto.component';
//Firestore modules
import { environment } from '../environments/environment';
import  { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { IntroductionComponent } from './introduction/introduction.component';
import { InvestigatorComponent } from './investigator/investigator.component';
import { DetailviewComponent } from './detailview/detailview.component';

// const appRoutes: Routes = [
//   { path: "/tabledetail", component: DetailviewComponent }
// ];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TableComponent,
    LmpdArapidopsisComponent,
    HomepageComponent,
    DataAnalysisComponent,
    DatatableComponent,
    GoNetworkComponent,
    // GraphComponent,
    // NgCytoComponent,
    IntroductionComponent,
    InvestigatorComponent,
    DetailviewComponent
    // CytodemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'fatplant'),
    AngularFirestoreModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatMenuModule,
    CytoscapeModule,
    CdkTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
