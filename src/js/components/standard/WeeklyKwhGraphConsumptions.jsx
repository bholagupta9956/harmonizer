// Here we are writing the code for getting the graph data in the weekly kwh graph ;

import React from "react";
import { Bar } from "react-chartjs-2";
import "../../../styles/graph.css";


const WeeklyKwhGraphConsumptions = (props) => {

    const {kwhData} = props ;

    console.log(kwhData , "Kdw")

    const label = kwhData.map((itm,index) =>{
        return itm.deviceName
    })

    const allData = kwhData.map((itm,index) =>{
        return itm.dailyKwh
    })


    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            // text: "Chart.js Bar Chart",
          },
        },
      };
    
      const labels = label
    
      const data = {
        labels,
        datasets: [
          {
            label: "Daily Kwh",
            data: allData,
            backgroundColor: "#26a64e",
          },
        ],
      };

  return (
    <div className="graphCont">
      <Bar
        options={options}
        data={data}
        className="barGraph"
      />
    </div>
  );
};

export default WeeklyKwhGraphConsumptions;
