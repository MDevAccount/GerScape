import { OnInit, Component, ViewChild, Input, AfterViewInit } from '@angular/core';
import { ChartComponent, ApexDataLabels, ApexAxisChartSeries, ApexNonAxisChartSeries } from 'ng-apexcharts';
import { HighscoreService } from '../service/highscore.service';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-highscore-overview',
    templateUrl: 'highscore-overview.component.html',
    styleUrls: ['highscore-overview.component.css'],
})
export class HighscoreOverviewComponent implements OnInit {
    @ViewChild('chart', {static: true}) chart: ChartComponent;

    first: boolean = true;

    constructor(
        private store: Store<AppState>,
        private highscoreService: HighscoreService) {

    }

    ngOnInit() {
        this.createChart();

        this.store.select('highscore').subscribe(state => {
            let labels = [];
            let series = [];
            if (state.runemetricsProfile) {
                let totalLevel = state.runemetricsProfile.totalskill;
                labels.push("Alles 99");
                series.push(this.getPercentOfAndMax100(totalLevel, HighscoreService.MAX_LEVEL));
                labels.push("Comp Cape Stats");
                series.push(this.getPercentOfAndMax100(totalLevel, HighscoreService.COMP_LEVEL));
                labels.push("Alles 120");
                let virtualLevelMax120 = 0;
                state.runemetricsProfile.skillvalues.forEach(skilLValue => {
                    let level = this.highscoreService.getLevelForXp(skilLValue.xp);
                    virtualLevelMax120 += level > 120 ? 120 : level;
                });
                series.push(this.getPercentOfAndMax100(virtualLevelMax120, HighscoreService.ALL_120_TOTAL_LEVEL));
                labels.push("Alles 200m");
                let epMaxSkillsCount = state.runemetricsProfile.skillvalues.filter(skillValue => skillValue.xp == HighscoreService.MAX_SKILL_XP).length;
                series.push(this.getPercentOfAndMax100(epMaxSkillsCount, HighscoreService.SKILL_NAMES.length));
              
            } else if(state.highscoreLight) {

            }
            console.log(this.first);
            if (state.runemetricsProfile.skillvalues.length > 5 && this.first == true) {
                this.updateChartLabels(["1", "1", "234", "34"]);
                this.updateChartSeries([50,50,12,12]);

                this.first = false;
            }    
        });
    }
    //   this.chart.fill = {
    //     type: 'gradient',
    //     gradient: {
    //       shade: 'dark',
    //       type: 'horizontal',
    //       shadeIntensity: 0.5,
    //       inverseColors: true,
    //       opacityFrom: 1,
    //       opacityTo: 1,
    //       stops: [0, 100]
    //     }
    //   }

    //   this.chart.legend = {
    //     show: true,
    //     position: 'left',
    //     offsetX: -40,
    //     offsetY: -10,
    //   //   formatter: function (val, opts) {
    //   //     return val + " - " + opts.w.globals.series[opts.seriesIndex] + '%';
    //   //   }
    //   }
  
    //   this.chart.plotOptions = {
    //     radialBar: {
    //       size: undefined,
    //       inverseOrder: false,
    //       hollow: {
    //         margin: 5,
    //         size: '48%',
    //         background: 'transparent',
    //       },
    //       track: {
    //         show: true,
    //         background: '#40475D',
    //         strokeWidth: '10%',
    //         opacity: 1,
    //         margin: 3, // margin is in pixels
    //       },
    
    
    //     },
    //   };



    



    private createChart() {
        this.chart.chart = {
            type: 'radialBar',
            height: 320
        };
        this.chart.plotOptions = {
            radialBar: {
              dataLabels: {
                name: {
                  fontSize: '22px',
                },
                value: {
                  fontSize: '16px',
                },
                total: {
                  show: true,
                  label: 'Total'
                //   formatter: function (w) {
                //       console.log(w);
                //     // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                //     return 249
                //   }
                }
              }
            }
          };
        this.updateChartSeries([]);
        this.updateChartLabels([]);
    }

    private updateChartSeries(series: number[]) {
        this.chart.series = series;
    }

    private updateChartLabels(labels: string[]) {
        this.chart.labels = labels;
    }

    getPercentOfAndMax100(base: number, from: number) {

        let percent = (base / from) * 100;
        //console.log("(" + base + "/" + from + ") = " + (base / from));
        //console.log("(" + base + "/" + from + ") * 100 = " + ((base / from) * 100));
        return (percent > 100) ? 100 : percent;
    }

    
  
   
}