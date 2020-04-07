import { Component, OnInit } from '@angular/core';


import * as d3 from 'd3-selection';  
import * as d3Scale from 'd3-scale';  
import * as d3Shape from 'd3-shape';  
import * as d3Array from 'd3-array';  
import * as d3Axis from 'd3-axis';  

import * as d3Zoom from 'd3-zoom';
import * as d3Brush from 'd3-brush';

// import * as d31 from 'd3';

import * as moment from 'moment';

import  *  as  data  from  '../../assets/new.json';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})


export class LineChartComponent implements OnInit {  


    title = 'Line Chart';
    selected = 0;
    data: any[] = data.points;  

  
    private margin = {top: 20, right: 20, bottom: 110, left: 40};  
    private margin2  = {top: 430, right: 20, bottom: 30, left: 40};  
    private width: number;  
    private height: number;  
    private height2: number;

    private x: any;  
    private x2: any;
    private y: any;  
    private y2: any;
    private svg: any; 
    private xAxis: any;
    private xAxis2: any; 
    private yAxis: any; 


    private context: any;
	  private brush: any;
	  private zoom: any;
	  private area2:  d3Shape.Area<[number, number]>;
	  private focus: any;


    private line: d3Shape.Line<[number, number]>; // this is line defination
    private area: d3Shape.Area<[number, number]>; // this is line defination  

  constructor() {   
      // configure margins and width/height of the graph  
	  
	this.width = 960 - this.margin.left - this.margin.right;  
   this.height = 500 - this.margin.top - this.margin.bottom;
   this.height2 = 500 - this.margin2.top - this.margin2.bottom;
   }  
  
  ngOnInit() {  
  console.log(this.selected)
    this.buildSvg();  
        this.addXandYAxis();  
        this.drawLineAndPath();  
  }  

  onChangeObj(newObj) {
    console.log(newObj);
    this.selected = parseInt(newObj.target.value);
    d3.select("svg").remove(); 
	var svg = d3.select("app-line-chart").append("svg").attr("width","960").attr("height", "600"),
	inner = svg.append("g");               

    this.buildSvg();  
        this.addXandYAxis();  
        this.drawLineAndPath();  
  }

  private buildSvg() {  
        this.svg = d3.select('svg')  
            .style("stroke", "#000")
			.style("fill", "#4682b3") 
    }  
    private addXandYAxis() {  
         // range of data configuring  
         this.x = d3Scale.scaleTime().range([0, this.width]);

           this.x2 = d3Scale.scaleTime().range([0, this.width]);


         this.y = d3Scale.scaleLinear().range([this.height, 0]); 

         this.y2 = d3Scale.scaleLinear().range([this.height2, 0]);


         
  
        // Configure the X Axis 

        this.xAxis = d3Axis.axisBottom(this.x);

        this.xAxis2 = d3Axis.axisBottom(this.x2);

        this.yAxis = d3Axis.axisLeft(this.y);

        
        // Configure the Y Axis  
        

        this.brush = d3Brush.brushX()
        .extent([[0, 0], [this.width, this.height2]])
        .on('brush end', this.brushed.bind(this));


        this.zoom = d3Zoom.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [this.width, this.height]])
        .extent([[0, 0], [this.width, this.height]])
        .on('zoom', this.zoomed.bind(this));


        this.area = d3Shape.area()
        	.curve(d3Shape.curveMonotoneX)
	        .x((d: any) => this.x(moment("Wed Apr 01 2020 15:30:00 GMT-0500", "hh:mm:ss A")
        	.add(d.time * 5, 'minutes') ))
	        .y0(this.height)
	        .y1((d: any) => this.y(d["Array"][this.selected]));

	    this.area2 = d3Shape.area()
	        .curve(d3Shape.curveMonotoneX)
	        .x((d: any) => this.x2(moment("Wed Apr 01 2020 15:30:00 GMT-0500", "hh:mm:ss A")
        	.add(d.time * 5, 'minutes') ))
	        .y0(this.height2)
	        .y1((d: any) => this.y2(d["Array"][this.selected]));

	    this.svg.append('defs').append('clipPath')
	        .attr('id', 'clip')
	        .append('rect')
	        .attr('width', this.width)
	        .attr('height', this.height);

	    this.focus = this.svg.append('g')
	        .attr('class', 'focus')
	        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

	    this.context = this.svg.append('g')
	        .attr('class', 'context')
	        .attr('transform', 'translate(' + this.margin2.left + ',' + this.margin2.top + ')');
    }  
  	


  	private brushed() {
	    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
	    let s = d3.event.selection || this.x2.range();
	    this.x.domain(s.map(this.x2.invert, this.x2));
	    this.focus.select('.area').attr('d', this.area);
	    this.focus.select('.axis--x').call(this.xAxis);
	    this.svg.select('.zoom').call(this.zoom.transform, d3Zoom.zoomIdentity
	        .scale(this.width / (s[1] - s[0]))
	        .translate(-s[0], 0));
	}

	private zoomed() {
	    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
	    let t = d3.event.transform;
	    this.x.domain(t.rescaleX(this.x2).domain());
	    this.focus.select('.area').attr('d', this.area);
	    this.focus.select('.axis--x').call(this.xAxis);
	    this.context.select('.brush').call(this.brush.move, this.x.range().map(t.invertX, t));
	  }



    private drawLineAndPath() {  


    	this.x.domain(d3Array.extent(this.data, (d : any) => { return moment("Wed Apr 01 2020 15:30:00 GMT-0500", "hh:mm:ss A")
    	        .add(d.time * 5, 'minutes') }));  


        this.y.domain([0, d3Array.max(this.data, (d : any) => { return d["Array"][this.selected]; })])

    	this.x2.domain(this.x.domain());
    	this.y2.domain(this.y.domain());


    	this.focus.append('path')
	        .datum(this.data)
	        .attr('class', 'area')
	        .attr('d', this.area);

	    this.focus.append('g')
	        .attr('class', 'axis axis--x')
	        .attr('transform', 'translate(0,' + this.height + ')')
	        .call(this.xAxis);

	    this.focus.append('g')
	        .attr('class', 'axis axis--y')
	        .call(this.yAxis);

	    this.context.append('path')
	        .datum(this.data)
	        .attr('class', 'area')
	        .attr('d', this.area2);

	    this.context.append('g')
	        .attr('class', 'axis axis--x')
	        .attr('transform', 'translate(0,' + this.height2 + ')')
	        .call(this.xAxis2);

	    this.context.append('g')
	        .attr('class', 'brush')
	        .call(this.brush)
	        .call(this.brush.move, this.x.range());

	    this.svg.append('rect')
	    	.style("fill", "transparent") 
	        .attr('class', 'zoom')
	        .attr('width', this.width)
	        .attr('height', this.height)
	        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
	        .call(this.zoom);






    }  
  
}  
