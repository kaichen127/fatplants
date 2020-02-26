import {Component, Output, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Component({
    selector: 'cy-graph',
    templateUrl: './graph.component.html',
    styles: [`
      ng2-cytoscape {
        height: 100vh;
        float: left;
        width: 100%;
        position: relative;
    }`],
})

export class GraphComponent {

    node_name: string;

    layout = {
                name: 'circle',
                rankDir: 'LR',
                directed: false,
                padding: 0,
            };

   graphData = {
            nodes: [
                { data: { id: 'a', name: 'ACX1', weight: 100, colorCode: 'black', shapeType: 'roundrectangle', details: 'ACX1' } },
                { data: { id: 'b', name: 'PKT3', weight: 100, colorCode: 'black', shapeType: 'roundrectangle', details: 'ACX1' } },
                { data: { id: 'c', name: 'AIM1', weight: 100, colorCode: 'black', shapeType: 'roundrectangle', details: 'ACX1' } },
                { data: { id: 'd', name: 'ACX5', weight: 100, colorCode: 'black', shapeType: 'roundrectangle', details: 'ACX1' } },
                { data: { id: 'e', name: 'MFP2', weight: 100, colorCode: 'black', shapeType: 'roundrectangle', details: 'ACX1' } },
                { data: { id: 'f', name: 'ACX2', weight: 100, colorCode: 'black', shapeType: 'roundrectangle', details: 'ACX1' } },
                { data: { id: 'j', name: 'ACX2', weight: 100, colorCode: 'black', shapeType: 'ellipse', details: 'ACX1' } }
            ],
            edges: [
                { data: { source: 'a', target: 'b', colorCode: 'gray', strength: 10 } },
                { data: { source: 'b', target: 'c', colorCode: 'gray', strength: 10 } },
                { data: { source: 'c', target: 'd', colorCode: 'gray', strength: 10 } },
                { data: { source: 'c', target: 'e', colorCode: 'gray', strength: 10 } },
                { data: { source: 'c', target: 'f', colorCode: 'gray', strength: 10 } },
                { data: { source: 'e', target: 'j', colorCode: 'gray', strength: 10 } }
            ]
    };

    constructor(private http: HttpClient) {
      this.http.get('/data').subscribe((res: any) => {
        console.log(res);
      });
    }
    nodeChange(event) {
        this.node_name = event;
    }

}
