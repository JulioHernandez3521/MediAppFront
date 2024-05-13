import {Component, OnInit, signal} from '@angular/core';
import {MaterialModule} from "../../material/material.module";
import {ConsultService} from "../../services/consult.service";
import {Chart, ChartType} from "chart.js/auto";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    MaterialModule,
    PdfViewerModule
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent  implements OnInit{
  chart?:Chart;
  typer:ChartType = 'line';
  bar:ChartType = 'bar';
  doughnut:ChartType = 'doughnut';
  radar:ChartType = 'radar';
  pie:ChartType = 'pie';
  line:ChartType = 'line';

  pdfSrc?:string;
  selectedFiles?:FileList;
  fileName?:string;
  imageData?:SafeResourceUrl;
  imageSignal = signal(this.sanitazer.bypassSecurityTrustResourceUrl(""));

  constructor(private consultService: ConsultService, private sanitazer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.draw();
  }

  change(id: string){
    switch (id){
      case 'pie':{
        this.typer = this.pie;
        break;
      }case 'bar':{
        this.typer = this.bar;
        break;
      }case 'doughnut':{
        this.typer = this.doughnut;
        break;
      }case 'radar':{
        this.typer = this.radar;
        break;
      }
      default: {
        this.typer = this.line;
        break;
      }

    }
    if(this.chart) this.chart.destroy();
    this.draw();
  }

  draw(){
    this.consultService.callProcedureOrFunction().subscribe(data => {
      const dates = data.map((x:any)=> x.consultdate);
      const quantities = data.map((z:any)=> z.quantity);
      console.warn(dates,quantities);

      this.chart = new Chart('canvas', {
          type:this.typer,
          data:{
            labels: dates,
            datasets: [
              {
                label: 'Quantity',
                data: quantities,
                borderColor: '#3cba9f',
                fill: false,
                backgroundColor:[
                  'rgba(255,99,132,0.2)',
                  'rgba(54,162,235,0.2)',
                  'rgba(255,206,86,0.2)',
                  'rgba(75,192,192,0.2)',
                  'rgba(153,102,0,0.2)',
                  'rgba(255,159,64,0.2)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options:{
            scales:{
              x:{
                display: true
              },
              y:{
                display: true,
                beginAtZero:true
              }
            }
          }
      });
    }, error => {});
  }

  viewReport(){
    this.consultService.generateReport().subscribe(data => {
      this.pdfSrc = window.URL.createObjectURL(data);

    },error => {});
  }

  downloadReport(){
      this.consultService.generateReport().subscribe(data => {
          const url = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.setAttribute('style','displar:none');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'report.pdf';
          a.click();
      },error => {});
  }

  selectFile(event:any){
      this.selectedFiles = event.target.files;
      this.fileName = event.target.files[0]?.fileName;
  }

  upload(){
    this.consultService.saveFile(this.selectedFiles?.item(0)).subscribe(data => {

    },error => {});
  }

  viewImage(id:number){
    this.consultService.readFile(id).subscribe(data => {
        // this.imageData = data;
      this.convertToBase64(data);
    })
  }
  convertToBase64(data:any){
    const reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      const base64 = reader.result;
      // this.imageData = base64;
      this.applySanitaizer(base64);
    };
  }

  applySanitaizer(base64: any){
    this.imageData = this.sanitazer.bypassSecurityTrustResourceUrl(base64);
    this.imageSignal.set(this.imageData);
  }
}
