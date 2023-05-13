import React from "react";
import Chart from "react-apexcharts";     

const MultiLineGraph = (props) => {
    const {series,label,text} = props
   const optionss = {
      chart: {
       
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false
        }
      },
      colors: ['#871610' ,'#f6e80c','#100eeb'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: text,
        align: 'left'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      markers: {
        size: 1
      },
      xaxis: {
        // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        categories : label,
        title: {
          text: 'Date'
        }
      },
      yaxis: {
        title: {
          text: 'Value'
        },
        min: 5,
        max: 40
      },

      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
       
      }    
    }
    const options = {
      chart: {
        id: text
      },
      stroke: {
          width: 3
      },
      title: {
        text: text,
        align: 'left'
      },
      
      colors: ['#871610' ,'#f6e80c','#100eeb'],
      xaxis: {
        categories: label
      }
  };
    // const series = [
    //   {
    //     name: "High - 2013",
    //     data: [28, 29, 33, 36, 32, 32, 33]
    //   },
    //   {
    //     name: "Low - 2013",
    //     data: [12, 11, 14, 18, 17, 13, 13]
    //   }
    // ]


    
  return (
    <>
      <div className="text-cardHeading text-dark font-bold">{name}</div>
      <Chart options={options} series={series} type="line" />
    </>
  );
};

export default MultiLineGraph;