import { Component, OnChanges, ElementRef, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import avsdf from 'cytoscape-avsdf';
declare var cytoscape: any;

@Component({
    selector: 'ng2-cytoscape',
    template: '<div id="cy"></div>',
    styles: [`#cy {
        height: 100%;
        width: 100%;
        position: relative;
        left: 0;
        top: 0;
        margin-left: auto;
        margin-right: auto;
        border:1px solid #488b8f;
        
    }`]
})


export class NgCytoComponent implements OnChanges {

    @Input() public elements: any;
    @Input() public style: any;
    @Input() public layout: any;
    @Input() public zoom: any;
    @Input() public data: any; //node description
    @Input() public graph: any; //GO or PPI

    @Output() select: EventEmitter<any> = new EventEmitter<any>();
    @Output() description: EventEmitter<any> = new EventEmitter<any>(); // description return



    public constructor(private renderer : Renderer2, private el: ElementRef) {

        this.layout = this.layout || {
                name: 'grid',
                directed: true,
                padding: 0
            };

        this.zoom = this.zoom || {
                min: 0.1,
                max: 1.5
            };

        this.style = this.style || cytoscape.stylesheet()

            .selector('node')
            .css({
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
            })
            .selector(':selected')
            .css({
                'border-width': 1,
                'border-color': 'black'
            })
            .selector('edge')
            .css({
              "opacity": ".3",
              "width": "mapData(weight, 0, 1, 1, 8)",
              "line-color": "#d0b7d5"
            })
            .selector('edge.questionable')
            .css({
                'line-style': 'dotted',
                'target-arrow-shape': 'diamond'
            })
            .selector('.faded')
            .css({
                'opacity': 0.25,
                'text-opacity': 0
            });
    }

    public ngOnChanges(): any {
        this.render();
        console.log(this.el.nativeElement);
    }

    public render() {
      let node_description: any;
      if (this.data!=undefined){
        node_description = this.data;
      }
      let localdescription = this.description;
      let localgraph = this.graph;

      let cy_contianer = this.renderer.selectRootElement("#cy");
      let localselect = this.select;
      cytoscape.use( avsdf );
      let cy = cytoscape({
            container : cy_contianer,
            layout: this.layout,
            minZoom: this.zoom.min,
            maxZoom: this.zoom.max,
            style: this.style,
            elements: this.elements,
        });


        cy.on('tap', 'node', function(e) {

          var node = e.target;

          //localselect.emit(node.data('name'));

          var nodeData = node.data();
          if (localgraph === 'GO'){
            for( var j=0;j<node_description.length;j++){
              if(nodeData['id'] == node_description[j]['GO']){
              localdescription.emit(node_description[j]['Description']);
              console.log(node_description[j]['Description'])
              break;
              }
            }
          }
          if(localgraph === 'PPI'){
            for( var j=0;j<node_description.length;j++){
              if(nodeData['id'] == node_description[j]['node']){
                localdescription.emit(node_description[j]['annotation']);
                console.log(node_description[j]['annotation'])
                break;
              }
            }

          }
        });

        cy.on('tap', function(e) {
                if (e.target === cy) {
                  localdescription.emit('');
                }
        });

    }


}
