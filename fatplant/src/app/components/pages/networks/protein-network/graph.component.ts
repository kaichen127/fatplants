import {Component, Output, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Component({
    selector: 'cy-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})

export class GraphComponent {
  visiable: boolean;
  filter: string;
  node_name: string;
  node_description: any;
  layout = {};
  style=[];
  pathways: any;
  selectedpathway: string;
  graph: string;
  descriptionList={};

  graphData = {nodes: [], edges: []};

    constructor(private http: HttpClient) {
      this.graph = 'PPI';
      this.pathways = [
        {value: 'Glycerophospholipid metabolism'},
        {value: 'Biosynthesis of secondary metabolites'},
        {value: 'Metabolic pathways'},
        {value: 'Terpenoid backbone biosynthesis'},
        {value: 'Phosphatidylinositol signaling system'},
        {value: 'Fatty acid metabolism'},
        {value: 'Inositol phosphate metabolism'},
        {value: 'Fatty acid biosynthesis'},
        {value: 'Glycerolipid metabolism'},
        {value: 'alpha-Linolenic acid metabolism'},
        {value: 'Ether lipid metabolism'},
        {value: 'Steroid biosynthesis'},
        {value: 'Fatty acid elongation'},
        {value: 'Diterpenoid biosynthesis'},
        {value: 'Biosynthesis of unsaturated fatty acids'},
        {value: 'Peroxisome'},
        {value: 'Sesquiterpenoid and triterpenoid biosynthesis'},
        {value: 'Carotenoid biosynthesis'},
        {value: 'Cutin, suberine and wax biosynthesis'},
        {value: 'Sphingolipid metabolism'},
        {value: 'Biosynthesis of antibiotics'},
        {value: 'Fatty acid degradation'}
      ];

    }
  ngOnInit() {
    this.visiable = false;
    this.layout = {
      name: 'cose',
      idealEdgeLength: 100,
      nodeOverlap: 20,
      refresh: 20,
      fit: true,
      padding: 30,
      randomize: false,
      componentSpacing: 100,
      nodeRepulsion: 400000,
      edgeElasticity: 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0
    };
    this.style = [
      {
        "selector": "core",
        "style": {
          "selection-box-color": "#AAD8FF",
          "selection-box-border-color": "#8BB0D0",
          "selection-box-opacity": "0.5"
        }
      }, {
        "selector": "node",
        "style": {
          "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
          "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
          "content": "data(name)",
          "font-size": "12px",
          "text-valign": "center",
          "text-halign": "center",
          "background-color": "#555",
          "text-outline-color": "#555",
          "text-outline-width": "2px",
          "color": "#fff",
          "overlay-padding": "6px",
          "z-index": "10"
        }
      }, {
        "selector": "node[?attr]",
        "style": {
          "shape": "rectangle",
          "background-color": "#aaa",
          "text-outline-color": "#aaa",
          "width": "16px",
          "height": "16px",
          "font-size": "6px",
          "z-index": "1"
        }
      }, {
        "selector": "node[?query]",
        "style": {
          "background-clip": "none",
          "background-fit": "contain"
        }
      }, {
        "selector": "node:selected",
        "style": {
          "border-width": "6px",
          "border-color": "#AAD8FF",
          "border-opacity": "0.5",
          "background-color": "#77828C",
          "text-outline-color": "#77828C"
        }
      }, {
        "selector": "edge",
        "style": {
          "curve-style": "haystack",
          "haystack-radius": "0.5",
          "opacity": "0.4",
          "line-color": "#bbb",
          "width": "mapData(weight, 0, 1, 1, 8)",
          "overlay-padding": "3px"
        }
      }, {
        "selector": "node.unhighlighted",
        "style": {
          "opacity": "0.2"
        }
      }, {
        "selector": "edge.unhighlighted",
        "style": {
          "opacity": "0.05"
        }
      }, {
        "selector": ".highlighted",
        "style": {
          "z-index": "999999"
        }
      }, {
        "selector": "node.highlighted",
        "style": {
          "border-width": "6px",
          "border-color": "#AAD8FF",
          "border-opacity": "0.5",
          "background-color": "#394855",
          "text-outline-color": "#394855"
        }
      }, {
        "selector": "edge.filtered",
        "style": {
          "opacity": "0"
        }
      }, {
        "selector": "edge[group=\"1\"]",
        "style": {
          "line-color": "#d0b7d5"
        }
      }, {
        "selector": "edge[group=\"2\"]",
        "style": {
          "line-color": "#a0b3dc"
        }
      }, {
        "selector": "edge[group=\"3\"]",
        "style": {
          "line-color": "#90e190"
        }
      }, {
        "selector": "edge[group=\"4\"]",
        "style": {
          "line-color": "#9bd8de"
        }
      }, {
        "selector": "edge[group=\"5\"]",
        "style": {
          "line-color": "#eaa2a2"
        }
      }, {
        "selector": "edge[group=\"6\"]",
        "style": {
          "line-color": "#f6c384"
        }
      }, {
        "selector": "edge[group=\"7\"]",
        "style": {
          "line-color": "#dad4a2"
        }
      }, {
        "selector": "edge[group=\"8\"]",
        "style": {
          "line-color": "#D0D0D0"
        }
      }, {
        "selector": "edge[group=\"9\"]",
        "style": {
          "line-color": "#D0D0D0"
        }
      }, {
        "selector": "edge[group=\"10\"]",
        "style": {
          "line-color": "#D0D0D0"
        }
      }, {
        "selector": "edge[group=\"11\"]",
        "style": {
          "line-color": "#f0ec86"
        }
      }
    ];
    this.http.get('https://us-central1-fatplant-76987.cloudfunctions.net/ppidata?pathway=Glycerophospholipid metabolism').subscribe((res: any) => {
      console.log(res);
      for (let item of res[0]) {
        if (item.group === 'nodes') {
          this.graphData.nodes.push({data: item.data});
        }
        if (item.group === 'edges') {
          this.graphData.edges.push({data: item.data});
        }
      }
      console.log(this.graphData);
      this.http.get('https://us-central1-fatplant-76987.cloudfunctions.net/ppinodedescription').subscribe((res: any) => {
        console.log(res);
        this.node_description = res;
        this.visiable = true;

      });

    });

  }
  selectionChange(){
      console.log(this.selectedpathway);
      this.visiable = false;
      this.http.get('https://us-central1-fatplant-76987.cloudfunctions.net/ppidata?pathway=' + this.selectedpathway.toString()).subscribe((res: any) => {
      console.log(res);
      this.graphData = {nodes: [], edges: []};
      for (let item of res[0]) {
        if (item.group === 'nodes') {
          this.graphData.nodes.push({data: item.data});
        }
        if (item.group === 'edges') {
          this.graphData.edges.push({data: item.data});
        }
      }
      this.visiable = true;
    });
  }
  nodeChange(event) {
      let splitres = event.split(';')
      this.descriptionList = [{
        name: splitres[0],
        desList: splitres[1].split('.')
      }]

    this.node_name = event;
  }
  layoutChange(event){
    this.visiable = false;
    switch (event.toElement.value) {
      case 'cose':
        this.layout = {
          name: 'cose',
          idealEdgeLength: 100,
          nodeOverlap: 20,
          refresh: 20,
          fit: true,
          padding: 30,
          randomize: false,
          componentSpacing: 100,
          nodeRepulsion: 400000,
          edgeElasticity: 100,
          nestingFactor: 5,
          gravity: 80,
          numIter: 1000,
          initialTemp: 200,
          coolingFactor: 0.95,
          minTemp: 1.0
        };
        this.style = [
          {
            "selector": "core",
            "style": {
              "selection-box-color": "#AAD8FF",
              "selection-box-border-color": "#8BB0D0",
              "selection-box-opacity": "0.5"
            }
          }, {
            "selector": "node",
            "style": {
              "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
              "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
              "content": "data(name)",
              "font-size": "12px",
              "text-valign": "center",
              "text-halign": "center",
              "background-color": "#555",
              "text-outline-color": "#555",
              "text-outline-width": "2px",
              "color": "#fff",
              "overlay-padding": "6px",
              "z-index": "10"
            }
          }, {
            "selector": "node[?attr]",
            "style": {
              "shape": "rectangle",
              "background-color": "#aaa",
              "text-outline-color": "#aaa",
              "width": "16px",
              "height": "16px",
              "font-size": "6px",
              "z-index": "1"
            }
          }, {
            "selector": "node[?query]",
            "style": {
              "background-clip": "none",
              "background-fit": "contain"
            }
          }, {
            "selector": "node:selected",
            "style": {
              "border-width": "6px",
              "border-color": "#AAD8FF",
              "border-opacity": "0.5",
              "background-color": "#77828C",
              "text-outline-color": "#77828C"
            }
          }, {
            "selector": "edge",
            "style": {
              "curve-style": "haystack",
              "haystack-radius": "0.5",
              "opacity": "0.4",
              "line-color": "#bbb",
              "width": "mapData(weight, 0, 1, 1, 8)",
              "overlay-padding": "3px"
            }
          }, {
            "selector": "node.unhighlighted",
            "style": {
              "opacity": "0.2"
            }
          }, {
            "selector": "edge.unhighlighted",
            "style": {
              "opacity": "0.05"
            }
          }, {
            "selector": ".highlighted",
            "style": {
              "z-index": "999999"
            }
          }, {
            "selector": "node.highlighted",
            "style": {
              "border-width": "6px",
              "border-color": "#AAD8FF",
              "border-opacity": "0.5",
              "background-color": "#394855",
              "text-outline-color": "#394855"
            }
          }, {
            "selector": "edge.filtered",
            "style": {
              "opacity": "0"
            }
          }, {
            "selector": "edge[group=\"1\"]",
            "style": {
              "line-color": "#d0b7d5"
            }
          }, {
            "selector": "edge[group=\"2\"]",
            "style": {
              "line-color": "#a0b3dc"
            }
          }, {
            "selector": "edge[group=\"3\"]",
            "style": {
              "line-color": "#90e190"
            }
          }, {
            "selector": "edge[group=\"4\"]",
            "style": {
              "line-color": "#9bd8de"
            }
          }, {
            "selector": "edge[group=\"5\"]",
            "style": {
              "line-color": "#eaa2a2"
            }
          }, {
            "selector": "edge[group=\"6\"]",
            "style": {
              "line-color": "#f6c384"
            }
          }, {
            "selector": "edge[group=\"7\"]",
            "style": {
              "line-color": "#dad4a2"
            }
          }, {
            "selector": "edge[group=\"8\"]",
            "style": {
              "line-color": "#D0D0D0"
            }
          }, {
            "selector": "edge[group=\"9\"]",
            "style": {
              "line-color": "#D0D0D0"
            }
          }, {
            "selector": "edge[group=\"10\"]",
            "style": {
              "line-color": "#D0D0D0"
            }
          }, {
            "selector": "edge[group=\"11\"]",
            "style": {
              "line-color": "#f0ec86"
            }
          }
        ];
        break;
      case 'cola':
        this.layout = {
          name: 'cola',
          maxSimulationTime: 3000,
        };
        break;
      case 'circle':
        this.layout = {
          name: 'circle',
        };
        break;
      case 'concentric':
        this.layout = {
          name: 'concentric',
        };
        break;
      default:
        break;

    }
    this.visiable = true;

  }

}
