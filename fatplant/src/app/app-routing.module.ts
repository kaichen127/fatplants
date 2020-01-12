import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LmpdArapidopsisComponent } from './lmpd-arapidopsis/lmpd-arapidopsis.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DataAnalysisComponent } from './data-analysis/data-analysis.component';
import { GlmolComponent } from './glmol/glmol.component';
import { ColorPathwayComponent } from './color-pathway/color-pathway.component';
import { BlastComponent } from './blast/blast.component';


import { CameliaComponent } from './camelia/camelia.component';
import { FattyacidComponent } from './fattyacid/fattyacid.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { InvestigatorComponent } from './investigator/investigator.component';
import { GraphComponent } from './graph/graph.component';
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { FileviewComponent } from './fileview/fileview.component';
// import { CytodemoComponent } from './cytodemo/cytodemo.component';
import { LmpddetailviewComponent } from './lmpddetailview/lmpddetailview.component';


const routes: Routes = [{path: '', redirectTo: '/homepage', pathMatch: 'full'},
{path: 'homepage', component: HomepageComponent},
{path: 'introduction', component: IntroductionComponent},
{path: 'investigator', component: InvestigatorComponent},
{path: 'lmpd_arapidopsis', component: LmpdArapidopsisComponent},
{path: 'data_analysis', component: DataAnalysisComponent}, // ???
{path: 'glmol', component: GlmolComponent},
{path: 'color-pathway', component: ColorPathwayComponent},
{path: 'camelina', component: CameliaComponent},
{path: 'fatty_acid', component: FattyacidComponent},
{path: 'graph', component: GraphComponent},
{path: 'one_click', component: DataAnalysisComponent},
{path: 'blast', component: BlastComponent},
{path:'upload',component:UploadFilesComponent},
{path:'viewfiles',component:FileviewComponent},
{path:'lmpddetailview/:uniprot_id',component:LmpddetailviewComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
