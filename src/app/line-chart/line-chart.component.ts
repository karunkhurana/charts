import { Component, OnInit } from '@angular/core';


import * as d3 from 'd3-selection';  
import * as d3Scale from 'd3-scale';  
import * as d3Shape from 'd3-shape';  
import * as d3Array from 'd3-array';  
import * as d3Axis from 'd3-axis';  

import * as d31 from 'd3';

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


    //data: any[] = [  
    //{date: new Date('2010-01-01'), value: 80},  
    //{date: new Date('2010-01-04'), value: 90},  
    //{date: new Date('2010-01-05'), value: 95},  
    //{date: new Date('2010-01-06'), value: 100},  
    //{date: new Date('2010-01-07'), value: 110},  
    //{date: new Date('2010-01-08'), value: 120},  
    //{date: new Date('2010-01-09'), value: 130},  
    //{date: new Date('2010-01-10'), value: 140},  
    //{date: new Date('2010-01-11'), value: 150},  
    //];  
  
    private margin = {top: 20, right: 20, bottom: 30, left: 50};  
    private width: number;  
    private height: number;  
    private x: any;  
    private y: any;  
    private svg: any;  
    private line: d3Shape.Line<[number, number]>; // this is line defination  
  
  constructor() {   
      // configure margins and width/height of the graph  
  
   this.width = 960 - this.margin.left - this.margin.right;  
   this.height = 500 - this.margin.top - this.margin.bottom;}  
  
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
            .append('g')  
            .style("opacity", .8)      // set the element opacity
.			style("stroke", "rgb(0, 0, 0)")
			.style("fill", "#656262")
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');  
    }  
    private addXandYAxis() {  
         // range of data configuring  
         this.x = d3Scale.scaleLinear().range([0, this.width]);  
         this.y = d3Scale.scaleLinear().range([this.height, 0]);  
         this.x.domain(d3Array.extent(this.data, (d) => d.time ));  
         this.y.domain([0, d31.max(this.data, (d) => { return d["Array"][this.selected]; })])
  
        // Configure the Y Axis  
        this.svg.append('g')  
            .attr('transform', 'translate(0,' + this.height + ')')  
            .call(d3Axis.axisBottom(this.x));  
        // Configure the Y Axis  
        this.svg.append('g')  
            .attr('class', 'axis axis--y')  
            .call(d3Axis.axisLeft(this.y));  
    }  
  
    private drawLineAndPath() {  
        this.line = d3Shape.line()  
            .x( (d: any) => {return this.x(d["time"])} )  
            .y( (d: any) => {console.log(this.x(d["Array"][this.selected])); return this.y(d["Array"][this.selected])} );  
        // Configuring line path  
        this.svg.append('path')  
            .datum(this.data)  
            .attr('class', 'line')  
            .attr('d', this.line);  
    }  
  
}  
