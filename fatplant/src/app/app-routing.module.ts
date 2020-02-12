import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { DataAnalysisComponent } from './data-analysis/data-analysis.component';
import { GlmolComponent } from './glmol/glmol.component';
import { ColorPathwayComponent } from './color-pathway/color-pathway.component';
import { BlastComponent } from './blast/blast.component';
import { GoNetworkComponent } from './go-network/go-network.component';


import { IntroductionComponent } from './components/pages/introductions/introduction/introduction.component';
import { InvestigatorComponent } from './components/pages/introductions/investigator/investigator.component';
import { GraphComponent } from './graph/graph.component';
// import { CytodemoComponent } from './cytodemo/cytodemo.component';
import { LmpddetailviewComponent } from './components/pages/datapages/lmpddetailview/lmpddetailview.component';
import { LmpdArapidopsisComponent } from './components/pages/datapages/lmpd-arapidopsis/lmpd-arapidopsis.component';
import { FattyacidComponent } from './components/pages/datapages/fattyacid/fattyacid.component';
import { CameliaComponent } from './components/pages/datapages/camelia/camelia/camelia.component';
import { UploadFilesComponent } from './components/pages/fileuploads/upload-files/upload-files.component';
import { FileviewComponent } from './components/pages/fileuploads/fileview/fileview.component';
import { SoybeanComponent } from './components/pages/datapages/soybean/soybean.component';


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
{path: 'go-network', component: GoNetworkComponent},
{path: 'one_click', component: DataAnalysisComponent},
{path: 'blast', component: BlastComponent},
{path:'upload',component:UploadFilesComponent},
{path:'viewfiles',component:FileviewComponent},
{path:'lmpddetailview/:uniprot_id',component:LmpddetailviewComponent},
{path:'fatty_acid',component:FattyacidComponent},
{path: 'soybean',component:SoybeanComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
