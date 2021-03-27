import { Component, OnInit } from '@angular/core';
import { CustomPathwaysService } from '../../../../services/custom-pathways/custom-pathways.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-custom-pathway',
  templateUrl: './custom-pathway.component.html',
  styleUrls: ['./custom-pathway.component.scss']
})
export class CustomPathwayComponent implements OnInit {

  constructor(private pathwayService: CustomPathwaysService,
              private activatedRoute: ActivatedRoute) { }

  showingUniprot = false;
  selectedGraph = null;

  ngOnInit(): void {
    
    this.activatedRoute.queryParams.subscribe(params => {
      var graphId = params['id'];

      this.pathwayService.getPathwayByTitle(graphId).subscribe(graph => {
        
        let graphAny: any = graph.payload.data();

        if (graphAny == undefined) {
          this.selectedGraph = null;
        }
        else {
          this.selectedGraph = graphAny;
        }
      });
    });
  }

}
