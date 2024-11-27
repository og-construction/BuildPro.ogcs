// Graph.js
import React, { useLayoutEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

const Graph = () => {
  useLayoutEffect(() => {
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.data = [
      { date: "2023-01-01", value: 50 },
      { date: "2023-01-02", value: 55 },
      { date: "2023-01-03", value: 65 },
      { date: "2023-01-04", value: 70 },
      { date: "2023-01-05", value: 60 }
    ];
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    dateAxis.title.text = "Date";
    valueAxis.title.text = "Value";
    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}";
    chart.scrollbarX = new am4core.Scrollbar();

    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
};

export default Graph;
