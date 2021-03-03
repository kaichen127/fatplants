import { Component, OnInit } from '@angular/core';
import { AralipsServiceService } from '../../../../services/aralips-service/aralips-service.service';

@Component({
  selector: 'app-pathway-aralips',
  templateUrl: './pathway-aralips.component.html',
  styleUrls: ['./pathway-aralips.component.scss']
})
export class PathwayAralipsComponent implements OnInit {
  constructor(private aralipsService:AralipsServiceService) { 
    
  }

  showingAralips = true;
  selectedGraph = null;
  pathwayOptions;

  // when the select input is changed
  onChange(newGraph) {
    this.aralipsService.getPathwayByTitle(newGraph).subscribe(graph => {
      this.selectedGraph = graph.payload.data();
    });
  }

  ngOnInit(): void {
    this.aralipsService.getAllPathways().subscribe(pathways => {
      
      let options = [];
      
      pathways.forEach(pathway => {

        let option = {
          id: pathway.payload.doc.id, 
          title: pathway.payload.doc.get('name')
        };

        options.push(option);
      });

      this.pathwayOptions = options;
      this.onChange(this.pathwayOptions[0].id);
    });

  }

}
