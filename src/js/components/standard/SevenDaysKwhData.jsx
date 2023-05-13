// here we are creating the graph which will show the kwh data for the seven days in the graph format ;

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { addDays } from "date-fns";
import "../../../../stories/styles.css";
import "../../../styles/weirMinerals.css";


const SevenDaysKwhData = (props) => {

  const { projects, devicesById } = props;
  const [allDevice, setAllDevice] = useState([]);
  const [weeklyKwh, setWeeklyKwh] = useState("");
  const [DeviceList, setDeviceList] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState({});
  const [showDeviceListBox, setShowDeviceListBox] = useState(false);
  const [selectedDeviceName, setSelectedDeviceName] = useState("");

  var devices = Object.values(devicesById);

  const getAllDevices = () => {
    setAllDevice([]);
    var firstDevice = devices[0];
    var projectDetails = projects[firstDevice.projectId];
    const projectName = projectDetails.name;

    firstDevice = {
      deviceId: firstDevice.deviceId,
      deviceName: firstDevice.name,
      projectId: firstDevice.projectId,
      projectName: projectName,
      name: `${firstDevice?.name} - ${projectName}`,
    };

    setSelectedDevice(firstDevice);
    var firstDeviceName = `${devices[0].name} - ${projectName}`;
    setSelectedDeviceName(firstDeviceName);

    for (var i = 0; i < devices.length; i++) {
      const data = devices[i];

      var projectDetails = projects[data.projectId];

      if (projectDetails) {
        const projectName = projectDetails.name;

        const dddd = {
          deviceId: data.deviceId,
          deviceName: data.name,
          projectId: data.projectId,
          projectName: projectName,
          name: `${data.name} - ${projectName}`,
        };

        setAllDevice((itm) => {
          return [...itm, dddd];
        });

        setDeviceList((itm) => {
          return [...itm, dddd];
        });
      }
    }
  };

  useEffect(() => {
    getAllDevices();
  }, []);

  // here we are getting the daily kwh result ;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allSelectedDates, setAllSelectedDates] = useState([]);
  const [allDeviceData, setAllDeviceData] = useState([]);
  const [dailyKwhData, setDailyKwhData] = useState([]);
  const [totalDailyKwh, setTotalDailyKwh] = useState(0);
  const [averageKwh, setAverageKwh] = useState(0);

  const getData2 = async (url) => {
    const res = await axios.get(url);
    const datt = res.data;
    return datt;
  };

  const getDeviceDataByDate = async (allDatesArray) => {
    setAllDeviceData([]);
    setDailyKwhData([]);
    setTotalDailyKwh(0);

    var kwhArray = [];
    var totalKwhData = 0;

    for (var j = 0; j < allDatesArray.length; j++) {
      const url = `https://rruok6m963.execute-api.ap-south-1.amazonaws.com/dev/project/${selectedDevice.projectId}/device/${selectedDevice.deviceId}/event?start_time=${allDatesArray[j]}T05:00:00Z&end_time=${allDatesArray[j]}T06:30:00Z`;

      const data2 = await getData2(url);

      if (data2.length != 0) {
        const md0 = data2.filter((itm, index) => {
          return itm.modeId == 0;
        });

        const md1 = data2.filter((itm, index) => {
          return itm.modeId == 1;
        });

        const mode0data = md0[0];
        const mode1data = md1[0];

        const dailyKwh = mode1data.parameters.filter((itm, index) => {
          return itm.key === "101";
        });

        const dailyKwhVal = dailyKwh[0].value;

        kwhArray.push(dailyKwhVal);
        totalKwhData = totalKwhData + dailyKwhVal;
      }
    }
    setTotalDailyKwh(totalKwhData);
    return kwhArray;
  };

  var getDates = function (start, end) {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  const handleStartDate = async (val) => {
    setStartDate(val);
    setEndDate("");
  };

  const handleEndDate = async (val) => {

    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
  }
        
    setEndDate(val);
    const allDates = await getDates(startDate, val);
    const allDatesArray = await allDates.map((v, ins) => {
      const dd = v.toISOString().slice(0, 10);
      return dd;
    });

    var endDate2 = new Date(val).addDays(1);
    var dd = endDate2.toISOString().slice(0, 10);
    var dateArrayForKwh = [...allDatesArray , dd];
    setAllSelectedDates(allDatesArray);
  
    var dateArrayForKwh = [...allDatesArray , dd];
    dateArrayForKwh.shift();
    const dailyKwhData = await getDeviceDataByDate(dateArrayForKwh);
    setDailyKwhData(dailyKwhData);
  };

  // -------------------------- //

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
 
  const labels = allSelectedDates;

  const data = {
    labels,
    datasets: [
      {
        label: "Daily Kwh",
        data: dailyKwhData,
        backgroundColor: "#26a64e",
      },
    ],
  };

  // here we are writing function of getting byDefault dates ;

  const getDailyKwh = async () => {
    Date.prototype.addDays = function (days) {
      this.setDate(this.getDate() - parseInt(days));

      var dd = this.getDate();
      var mm = this.getMonth() + 1;
      var yyyy = this.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      var date = yyyy + "-" + mm + "-" + dd;
      return date;
    };
    const day1 = new Date().addDays(7);
    const day2 = new Date().addDays(6);
    const day3 = new Date().addDays(5);
    const day4 = new Date().addDays(4);
    const day5 = new Date().addDays(3);
    const day6 = new Date().addDays(2);
    const day7 = new Date().addDays(1);
    const day8 = new Date().addDays(0)

    setStartDate(day1);
    setEndDate(day7);
    setAllSelectedDates([day1, day2, day3, day4, day5, day6, day7]);
    const dailyKwhData = await getDeviceDataByDate([
      day2,
      day3,
      day4,
      day5,
      day6,
      day7,
      day8
    ]);

    setDailyKwhData(dailyKwhData);
  };

  // writing functions for getting the weekly kwh data ;

  const getWeeklyKwh = async (selectedDevice) => {
    Date.prototype.addDays = function (days) {
      this.setDate(this.getDate() - parseInt(days));

      var dd = this.getDate();
      var mm = this.getMonth() + 1;
      var yyyy = this.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      var date = yyyy + "-" + mm + "-" + dd;
      return date;
    };

    const date = new Date();
    const day = date.getDay();

    if (day == 0) {
      const day1 = date.addDays(6);
      const day2 = date.addDays(1);
      const day3 = date.addDays(1);
      const day4 = date.addDays(1);
      const day5 = date.addDays(1);
      const day6 = date.addDays(1);
      const day7 = date.addDays(1);

      const weeklyKwh = await getDeviceDataByDate(
        [day1, day2, day3, day4, day5, day6, day7],
        selectedDevice
      );

      var totalWeeklyKwh = 0;

      weeklyKwh.map((itm, index) => {
        totalWeeklyKwh = totalWeeklyKwh + itm;
      });

      setWeeklyKwh(totalWeeklyKwh);
    } else {
      const num = day - 2;
      const day1 = date.addDays(num + 1);
      const day2 = date.addDays(1);
      const day3 = date.addDays(1);
      const day4 = date.addDays(1);
      const day5 = date.addDays(1);
      const day6 = date.addDays(1);
      const day7 = date.addDays(1);

      const weeklyKwh = await getDeviceDataByDate(
        [day1, day2, day3, day4, day5, day6, day7],
        selectedDevice
      );

      var totalWeeklyKwh = 0;

      weeklyKwh.map((itm, index) => {
        totalWeeklyKwh = totalWeeklyKwh + itm;
      });

      setWeeklyKwh(totalWeeklyKwh);
    }
  };

  useEffect(() => {
    getWeeklyKwh(selectedDevice);
    getDailyKwh();
  }, [selectedDevice]);

  const handleDeviceSelection = (e) => {
    setShowDeviceListBox(true);
    var val = e.target.value;
    val = val.toLowerCase();

    var filterDevices = allDevice.filter((itm, ind) => {
      console.log(itm.name.toLowerCase());
      return itm.name.toLowerCase().includes(val);
    });

    setSelectedDeviceName(val);
    setDeviceList(filterDevices);
  };

  const handleSelectedDevice = (dta) => {
    setSelectedDevice(dta);
    setSelectedDeviceName(dta.name);
    setShowDeviceListBox(false);
  };


  return (
    <div className="barCont2">
      <div className="SearchApp">
        <div className="seachOuter">
          <input
            type="search"
            value={selectedDeviceName}
            placeholder="Search Here"
            onChange={(e) => handleDeviceSelection(e)}
          />
          <button className="button" type="button"></button>
        </div>
        {showDeviceListBox && (
          <div className="searchlist">
            <ul>
              {DeviceList.map((itm, index) => {
                return (
                  <>
                    <li key={index} onClick={() => handleSelectedDevice(itm)}>
                      {" "}
                      {itm.name}
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div style={{ display: "flex" }}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => handleStartDate(e.target.value)}
          className="inputDate2"
          placeholder="startDate"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => handleEndDate(e.target.value)}
          className="inputDate2"
          placeholder="endDate"
        />
        <div className="totalCont">
          <div className="totalCont1">
            <h6 className="title">Total Kwh</h6>
            <h6>:</h6>
            <h6>{totalDailyKwh.toFixed(2)}</h6>
          </div>
          <div className="totalCont1">
            <h6 className="title">Average Kwh</h6>
            <h6>:</h6>
            <h6>{(totalDailyKwh / allSelectedDates.length).toFixed(2)}</h6>
          </div>
        </div>
      </div>
      <Bar options={options} data={data} />
    </div>
  );
};


export default SevenDaysKwhData;
