import {Component, OnInit} from '@angular/core';
import {MaterialModule} from "../../material/material.module";
import {ConsultService} from "../../services/consult.service";
import {Chart, ChartType} from "chart.js/auto";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import type = _default.defaults.animations.numbers.type;

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    MaterialModule
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

  constructor(private consultService: ConsultService) {
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
}
