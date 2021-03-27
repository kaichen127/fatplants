import { Component, OnInit } from '@angular/core';
import { CustomPathwaysService } from 'src/app/services/custom-pathways/custom-pathways.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-custom-pathway-list',
  templateUrl: './custom-pathway-list.component.html',
  styleUrls: ['./custom-pathway-list.component.scss']
})
export class CustomPathwayListComponent implements OnInit {

  constructor(private pathwayService: CustomPathwaysService,
              private formBuilder: FormBuilder) { }

  panelOpenState = false;
  dataSource = [];
  loading = true;
  displayedColumns = ["title", "paper", "link"];

  addPathwayForm: FormGroup;

  submitFiles() {
    let fileReader = new FileReader();
    let pathObject = {
      areas: [],
      imgPath: "",
      title: this.addPathwayForm.get("title"),
      paper: this.addPathwayForm.get("paper")
    };

    // setup reader function
    fileReader.onload = () => {
      var result: string = fileReader.result as string;
      var lines = result.split('\n');

      lines.forEach(line => {
        
        // break into initial segments
        var segments = line.split(" ");

        // remove parenthesis from coordinates
        segments[1] = segments[1].substring(1, segments[1].length);
        segments[2] = segments[2].substring(0, segments[2].length - 1);

        segments[3] = segments[3].substring(1, segments[3].length);
        segments[4] = segments[4].substring(0, segments[4].length - 1);

        // create coords string
        var coords = segments[1] + segments[2] + ',' + segments[3] + segments[4];
        
        // grab segmets of the link so we can get the ID portion
        var linkSegments = segments[5].split("/");

        // build object
        var documentObject = {
            shape: segments[0],
            coords: coords,
            uniProtLink: segments[5],
            fpLink: "https://www.fatplants.net/protein/" + linkSegments[linkSegments.length - 1],
            title: segments[6]
        };

        pathObject.areas.push(documentObject);
      });
    }

    

  }

  ngOnInit(): void {

    this.addPathwayForm = this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      paper: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      coordsFile: [null, [
        Validators.required
      ]],
      imgFile: [null, [
        Validators.required
      ]]
    });

    this.pathwayService.getAllPathways().subscribe(pathways => {
      pathways.forEach(graph => {
        let graphAny: any = graph.payload.doc.data();

        this.dataSource.push({
          title: graphAny.title,
          paper: 'Test',
          link: '/custom-pathway?id=' + graph.payload.doc.id
        });

        this.loading = false;
      });
    });
  }
}
