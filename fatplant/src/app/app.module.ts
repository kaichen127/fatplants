import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TableComponent } from './table/table.component';
import { LmpdArapidopsisComponent } from './lmpd-arapidopsis/lmpd-arapidopsis.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DataAnalysisComponent } from './data-analysis/data-analysis.component';
import { DatatableComponent } from './datatable/datatable.component';
import { MatTableModule } from '@angular/material';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { GraphComponent } from './graph/graph.component';
import {NgCytoComponent} from './ng-cyto/ng-cyto.component';

// import { CytodemoComponent } from './cytodemo/cytodemo.component';
import { CytoscapeModule } from 'ngx-cytoscape';
import { GoNetworkComponent } from './go-network/go-network.component';
// import { GraphComponent } from './go-network/graph/graph.component';
// import {NgCytoComponent} from './go-network/ng-cyto/ng-cyto.component';
//Firestore modules
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { GlmolComponent } from './glmol/glmol.component';
import { ColorPathwayComponent } from './color-pathway/color-pathway.component';
import { CameliaComponent } from './camelia/camelia.component';
import { FattyacidComponent } from './fattyacid/fattyacid.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { InvestigatorComponent } from './investigator/investigator.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatRadioModule} from "@angular/material/radio";
import {MatDividerModule} from "@angular/material/divider";




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
    GlmolComponent,
    ColorPathwayComponent,
    CameliaComponent,
    FattyacidComponent,
    GraphComponent,
    NgCytoComponent,
    IntroductionComponent,
    InvestigatorComponent,
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
    CdkTableModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTabsModule,
    MatRadioModule,
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
