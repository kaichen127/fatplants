import { Component, OnInit } from '@angular/core';
import { CustomPathwaysService } from 'src/app/services/custom-pathways/custom-pathways.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../../services/auth.service';
import { geneDict } from './gene_dictionary';

@Component({
  selector: 'app-custom-pathway-list',
  templateUrl: './custom-pathway-list.component.html',
  styleUrls: ['./custom-pathway-list.component.scss']
})
export class CustomPathwayListComponent implements OnInit {

  constructor(private pathwayService: CustomPathwaysService,
              private formBuilder: FormBuilder,
              private authService: AuthService) { }

  panelOpenState = false;
  dataSource = [];
  loading = true;
  displayedColumns = ["title", "paper", "link"];
  error: string = "";

  addPathwayForm: FormGroup;
  imgFile;
  coordFile;

  user: any = null;

  submitFiles() {
    this.error = "";
    this.loading = true;

    this.pathwayService.uploadPathwayImage(this.imgFile, this.imgFile.name).then(res => {
      res.ref.getDownloadURL().then(url => {
        let fileReader = new FileReader();
        let pathObject = {
          areas: [],
          imgPath: url,
          title: this.addPathwayForm.get("title").value,
          paper: this.addPathwayForm.get("paper").value
        };

        // setup reader function
        fileReader.onload = () => {
          var jsonObj = JSON.parse(fileReader.result as string);

          if (Array.isArray(jsonObj)) {
            for (var i = 1; i < jsonObj.length; i++) {
              var coords = jsonObj[i].coordinates[0]  + ',' + jsonObj[i].coordinates[1] + ',' + jsonObj[i].coordinates[2] + ',' + jsonObj[i].coordinates[3];
              var linkEnd = geneDict[jsonObj[i].gene_name.trim()];

              // if we don't get a result, try adding the comma
              if (linkEnd == undefined) {
                linkEnd = geneDict[jsonObj[i].gene_name.trim() + ','];
              }

              var documentObject = {
                shape: 'rect',
                coords: coords,
                uniProtLink: "https://www.uniprot.org/uniprot/" + linkEnd,
                fpLink: "https://www.fatplants.net/protein/" + linkEnd,
                title: jsonObj[i].gene_name
              };

              pathObject.areas.push(documentObject);
            }
          }
          else {
            throw("Could not parse the JSON file.");
          }
          /*var result: string = fileReader.result as string;
          var lines = result.split('\n');

          lines.forEach(line => {
            
            // break into initial segments
            var segments = line.split(" ");

            if (segments.length > 1 && segments != null) {
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
              
            }
          });
          */

          // upload the parsed coordinates
          this.pathwayService.uploadPathwayCoords(pathObject).then(res => {
            this.loading = false;
            this.error = "Successfully uploaded " + this.addPathwayForm.get("title").value;
          })
          .catch(err => {
            // signal error and delete image
            this.loading = false;
            this.error = "There was a problem uploading the coordinate file. Please contact an administrator or try again later.";
            res.ref.delete();
          });
        }

        // start file processing then upload
        fileReader.readAsText(this.coordFile);
      })
      // catch clause for image upload
      .catch(err => {
        // signal error
        this.error = "There was a problem uploading the image. Make sure it is a valid image file or verify your connection.";
        this.loading = false;
      });
    });

    
  }

  deleteButton(pathwayId, imgSrc) {
    this.loading = true;
    this.pathwayService.deletePathway(pathwayId, imgSrc).then(() => {
      this.loading = false;
    })
  }

  onImageFileChange(event) {
    if (event.target.files.length > 0)
      this.imgFile = event.target.files[0];
  }

  onCoordFileChange(event) {
    if (event.target.files.length > 0)
      this.coordFile = event.target.files[0];
  }

  ngOnInit(): void {

    // verify that user is signed in
    this.authService.checkUser().subscribe(res => {
      if (res !== null) {
        this.authService.findUser(res.email).subscribe(ret => {
          this.user = ret.docs[0].data();
          this.displayedColumns = ["title", "paper", "link", "actions"];
        });
      }
      else {
        this.user= null;
      }
    });

    // construct form validation
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

    // populate graph
    this.pathwayService.getAllPathways().subscribe(pathways => {
      this.dataSource = [];
      pathways.forEach(graph => {
        let graphAny: any = graph.payload.doc.data();

        this.dataSource.push({
          title: graphAny.title,
          paper: graphAny.paper,
          link: '/custom-pathway?id=' + graph.payload.doc.id,
          id: graph.payload.doc.id,
          imgPath: graphAny.imgPath
        });

        this.loading = false;
      });
    });
  }
}
