import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { CanvasJSChart } from "canvasjs-react-charts";
import { useSelector } from "react-redux";


const DailyKwhInPieChart = (props) => {

  const { devicesById } = props;
  const chartRef = useRef();
  var dateObj = new Date();

  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);
    return previous;
  }

  var day2 = new Date();
  var day = getPreviousDay(new Date(day2));


  var month = day.getMonth() + 1 < 10 ? `0${day.getMonth() + 1}` : day.getMonth() + 1
  var date = day.getDate() < 10 ? `0${day.getDate()}` : day.getDate();
  var year = day.getFullYear();

  var today1 = year + "-" + month + "-" + date;

  var today2 = (day2.getFullYear()) + '-' +  (day2.getMonth()+1 ? `0${day2.getMonth() +1}` : day2.getMonth() + 1) +  "-"  + (day2.getDate() < 10 ? `0${day2.getDate()}` : day2.getDate() )

  

  const [date2 , setDate2] = useState(today1)
  const [selectedDate, setSelectedDate] = useState(today2);
  const [kwhData, setKwhData] = useState([]);
  const [labelData, setLabelData] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);
  const [totalKwh, setTotalKwh] = useState(0);

  var allDevices = Object.values(devicesById);
  var allLgRoomDevices = allDevices.filter((devices, index) => {
    return devices.projectId == "ktrLX";
  });

  var filteredDevices = allLgRoomDevices.filter((devices, index) => {
    return (
      devices.name == "PCC 1" ||
      devices.name == "PCC 2" ||
      devices.name == "PCC 3" ||
      devices.name == "PCC 4" ||
      devices.name == "PCC 5" ||
      devices.name == "PCC 6" ||
      devices.name == "Incomer" || 
      devices.name == "ADMIN & STREET LIGHT"
    );
  });

  // var label = filteredDevices.map((devices, index) => {
  //   return devices.name;
  // });

  var allDevicesId = filteredDevices.map((devices, index) => {
    return devices.deviceId;
  });

  const data = {
    labels: labelData,
    datasets: [
      {
        label: "pannel power distribution",
        data: kwhData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(247, 2, 47, 0.2)",
          "rgba(245, 180, 0, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const getDevicesData = async () => {

    setKwhData([]);
    setLabelData([]);
    setDataPoints([]);
    setTotalKwh(0);

    var totalKwhss = 0;
    var dataPointss = [];


    allDevicesId.map((deviceId, index) => {

      var dgLightRoomProjectId = "ktrLX";
      var url = `https://rruok6m963.execute-api.ap-south-1.amazonaws.com/dev/project/${dgLightRoomProjectId}/device/${deviceId}/event?start_time=${selectedDate}T05:00:00Z&end_time=${selectedDate}T06:30:00Z`;

      axios
        .get(url)
        .then((res) => {
          if (res.status == 200) {
            var data = res.data;
            var deviceDataByMode1 = data.find((device, index) => {
              return device.modeId == 1;
            });

            var dailyKwh = deviceDataByMode1.parameters.find(
              (parameter, index) => {
                return parameter.key == "101";
              }
            );
            var dailyKwhValue = dailyKwh?.value;
            setKwhData((kwh) => {
              return [...kwh, dailyKwhValue];
            });

            var deviceName = filteredDevices.find((device, index) => {
              return device.deviceId == deviceId;
            });

            deviceName = deviceName.name;
            setLabelData((name) => {
              return [...name, deviceName];
            });

            var val = {
              y: dailyKwhValue,
              label: deviceName,
            };
            dataPointss.push(val);

            setDataPoints((dta) => {
              return [...dta, val];
            });
            setTotalKwh((kwh) => {
              return kwh + dailyKwhValue;
            });
            totalKwhss = totalKwhss + dailyKwhValue;
          }
        })
        .catch((err) => {
          console.log(err, "this is the error");
        });
    })

   
  };

  const customizeCharts = () =>{
    console.log(chartRef , "chartRef")
  }
 

  useEffect(() => {
    getDevicesData();
    customizeCharts();
  }, [selectedDate]);

 var chartData = dataPoints.sort((a,b) =>{
  return a.y - b.y
 })

 chartData.reverse();
 
 
  const options = {

    exportEnabled: false,
    animationEnabled: true,
    
    data: [
      {
        type: "pie",
        startAngle: 75,
        toolTipContent: `<b>{label}</b> : {y}`,
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 14,
        indexLabel: "{label} - {y}",
        dataPoints: chartData,
      },
    ],
  };
  
  function getNextDay(date = new Date()) {
    const next = new Date(date.getTime());
    next.setDate(date.getDate() + 1);
  
    return next;
  }

  const handleDate = async (e) =>{
    const val = e.target.value;
    setDate2(val);

    // var day = 
    var day = new Date(val)
    var nextDay = await getNextDay(day);
    
    var month = nextDay.getMonth() + 1 < 10 ? `0${nextDay.getMonth() + 1 }` : nextDay.getMonth() + 1;
    var date = nextDay.getDate() < 10 ? `0${nextDay.getDate()}` : nextDay.getDate();
    var year = nextDay.getFullYear();
  
    var dateToBeFetched = year + "-" + month + "-" + date;
   
    setSelectedDate(dateToBeFetched)

  }

  console.log(selectedDate , "selected Date here");

  return (
    <>
      <div
        className="w-full  py-4 my-8 "
        style={{ boxShadow: " rgb(0 0 0 / 24%) 0px 3px 8px" }}
      >
        <div className="flex justify-between items-center px-8 mb-2">
          <input
            type="date"
            value={date2}
            onChange={(e) => handleDate(e)}
            className="inputDate2"
            placeholder="startDate"
            max={new Date()}
          />
          <h2 style={{ fontWeight: "bold", fontSize: "20px" }}>
            Panel Power Distribution (Daily kWh)
          </h2>
        </div>
        <div className=" m-auto ">
          {/* <Pie data={data} style={{ height : '300px' , width : '300px' }}/> */}
          <CanvasJSChart options={options} ref={chartRef} />
        </div>
      </div>
    </>
  );
};

export default DailyKwhInPieChart;

// ktrLX ---> id of dg light room;
