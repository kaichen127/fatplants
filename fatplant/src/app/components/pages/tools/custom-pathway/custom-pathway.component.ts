import { Component, OnInit } from '@angular/core';
import { CustomPathwaysService } from '../../../../services/custom-pathways/custom-pathways.service';
import { ActivatedRoute, Router } from '@angular/router';
import { elementAt } from 'rxjs/operators';

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
  graphTable = null;

  displayedColumns = ["title", "fpLink", "uniProtLink"];

  /*myHover(element)
  {
    element.focus();
  }

  myLeave(element)
  {
    element.blur();
  }*/

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

          // we'll use this to quickly eliminate any duplicates
          var graphHash = {};
          this.graphTable = [];

          this.selectedGraph.areas.forEach(graphEntry => {
            // check the dictionary, if its not there, then
            // we need to grab this for the table
            if (graphHash[graphEntry.title] != 1) {
              // add it to the dictionary
              graphHash[graphEntry.title] = 1;

              // push it to our graph list
              this.graphTable.push({
                title: graphEntry.title,
                fpLink: graphEntry.fpLink,
                uniProtLink: graphEntry.uniProtLink
              });
            }
          });
        }
      });
    });
  }

}
