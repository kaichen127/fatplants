import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LmpdArapidopsisComponent } from './lmpd-arapidopsis/lmpd-arapidopsis.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DataAnalysisComponent } from './data-analysis/data-analysis.component';
import { GoNetworkComponent } from './go-network/go-network.component';
import { GlmolComponent } from './glmol/glmol.component';
import { ColorPathwayComponent } from './color-pathway/color-pathway.component';

import { CameliaComponent } from './camelia/camelia.component';
import { FattyacidComponent } from './fattyacid/fattyacid.component';


const routes: Routes = [{path:'',redirectTo:'/homepage',pathMatch:'full'},
{path:'homepage',component:HomepageComponent},
{path:'lmpd_arapidopsis',component:LmpdArapidopsisComponent},
{path:'data_analysis',component:DataAnalysisComponent},
{path:'go-network',component:GoNetworkComponent},
{path: 'glmol', component: GlmolComponent},
{path:'color-pathway',component:ColorPathwayComponent},
{path:'camelina',component:CameliaComponent},
{path:'fatty_acid',component:FattyacidComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
