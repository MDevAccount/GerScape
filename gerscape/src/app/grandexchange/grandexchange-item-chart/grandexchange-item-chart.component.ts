import { Component, OnInit } from '@angular/core'
import { Subscription, Observable } from 'rxjs'
import { AppState } from 'src/app/store/app.reducer'
import { Store } from '@ngrx/store'
import { GrandExchangeService } from '../service/grandexchange.service'
import * as GrandExchangeActions from '../store/grandexchange.actions'
import { GrandExchangeItemGraphData } from '../model/grandexchange-item-graph-data.model'

@Component({
    selector: 'app-grandexchange-item-chart',
    templateUrl: 'grandexchange-item-chart.component.html',
    styleUrls: ['grandexchange-item-chart.component.css'],
})
export class GrandExchangeItemChartComponent implements OnInit {
    series = []

    // ['#43E226', '#00C86D', '#00AA8F', '#008995']"

    yaxis = {
        showAlways: true,
        //min: 0,
        //tickAmount: 4,
    }

    xaxis = {
        type: 'datetime',

        //min: 0,
        //tickAmount: 4,
        //min: new Date('01 Mar 2012').getTime(),
        labels: {
            //show x axis descriptions downside
            show: true,
            showAlways: true,
            showDuplicates: false,
            style: {
                colors: ['#FFFFFF'],
                fontSize: '18px',
            },
            formatter: (val) => {
                const date = new Date(val)
                return date.getDay() + '. ' + date.toLocaleString('default', { month: 'short' })
            },
        },
        tooltip: {
            //tooltip on bottm of graph
            enabled: false,
        },
    }

    //area under the graphline
    fill = {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            colorStops: [
                // offset from y 0 to y 100%. color range and opacity
                {
                    offset: 0,
                    color: '#FFFFFF',
                    opacity: 0,
                },
                {
                    offset: 100,
                    color: '#43E226',
                    opacity: 0.5,
                },
            ],
        },
    }

    tooltip = {
        theme: 'dark',
        format: 'dd MMM yyyy',
        x: {
            show: true,
            format: 'dd MMM yyyy',
        },
        style: {
            fontSize: '12px',
        },
    }

    //punkte auf der linie, bzws der punkt wo man gerade mit der maus
    markers = {
        size: 0, //show marker for each datapoint true / false, buggy
        colors: ['#43E226', '#008995'],
        strokeWidth: 2, //size of a marker - buggy does not change
        strokeColors: '#393939', //color of shape around the dot / circle
        shape: 'circle',
    }

    //The line which is drawn
    stroke = {
        show: true,
        curve: 'smooth',
        lineCap: 'round', //sets style of start and endpoint
        colors: ['#43E226', '#008995'],
        strokeWidth: 3,
    }
    //"['#43E226', '#00C86D', '#00AA8F', '#008995']"

    chart = {
        type: 'area',
        width: 850,
        height: 350,
        //offsetX: -50,
        fontFamily: 'El Messiri',
        animations: {
            enabled: true,
            easing: 'easeout',
            speed: 1500,
            animateGradually: {
                enabled: true,
                delay: 150, // width while zooming gets smaller and wider
            },
            dynamicAnimation: {
                enabled: true,
                speed: 150, // width while zooming gets smaller and wider
            },
        },
        toolbar: {
            tools: {
                download: false,
                selection: true,
                //zoom: '<img src="/icons/zoom_in.svg" width="20">',
                //zoomin: '<img src="/icons/plus_circle.svg" width="20">',
                //zoomout: '<img src="/icons/minus_circle.svg" width="20">',
                pan: false,
                //reset: '<img src="/icons/home.svg" width="20">'
            },
            autoSelected: 'zoom',
            offsetX: -50,
        },
        dropShadow: {
            enabled: true,
            opacity: 0.2,
            blur: 5,
            left: -7,
            top: 15,
        },
    }

    storeSubscription: Subscription
    itemGraphsCallState$: Observable<string>

    constructor(
        private store: Store<AppState>,
        private grandExchangeService: GrandExchangeService
    ) {}

    ngOnInit() {
        this.storeSubscription = this.store
            .select((state: AppState) => state.grandExchange.currentGrandExchangeItemGraphData)
            .subscribe((itemGraph) => {
                if (itemGraph) {
                    this.updateChart(itemGraph)
                }
            })
    }

    updateChart(itemGraph: GrandExchangeItemGraphData) {
        let series1 = []
        let series2 = []

        itemGraph.average.forEach((avg) => {
            series1.push([avg.timeStamp, avg.price])
        })

        itemGraph.daily.forEach((day) => {
            series2.push([day.timeStamp, day.price])
        })

        let newSeries = []

        newSeries.push({ name: 'Täglich', data: series2 })

        newSeries.push({ name: 'Durschnitt', data: series1 })

        this.series = newSeries
    }
}
