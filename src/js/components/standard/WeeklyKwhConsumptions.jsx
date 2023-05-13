import React , {useState , useEffect} from 'react';
import {useSelector} from "react-redux";
import WeeklyKwhGraphConsumptions from './WeeklyKwhGraphConsumptions.jsx';


const WeeklyKwhConsumptions = (props) => {

  const {devicesById , dataFormat} = props;
  const { isLoading, projects } = useSelector((state) => state.projects);  
  const [kwhData, setKWhData] = useState([]);
  const [devicesByIdd, setDevicesByIdd] = useState([]);

    const getAllData = (dta) => {
       const AllDevices = Object.entries(dta);
   
        var ddd = [];

         for (var i = 0; i < AllDevices.length; i++) {
         const device = AllDevices[i][1];
         const deviceName = device.name;
         const projectId = device.projectId ;
      
          if(projectId === "ktrLX"){
       
          if (!deviceName.includes("PCC") && deviceName != "Incomer" && deviceName != "INCOMER") {

          const projectId = device.projectId;
          const projectName = projects[projectId]?.name;

          const mode1 = device.latestDataByModeId.filter((itm, index) => {
          return itm.modeId == 1;
          });

          const mode1Val = mode1 && mode1[0];
          const dailyKwh = mode1Val?.parameters.filter((itm, ind) => {
          return itm.key == "102";
          });
  

          const dailyKwhValue = dailyKwh && dailyKwh[0].value;
  
          const val = {
            projectName: projectName,
            deviceName: deviceName,
            dailyKwh: dailyKwhValue,
          };
          ddd.push(val);
        }
      } else if ( projectId === "QSiUZ"){
        if (deviceName != "To Servo Stabilizer"  && deviceName!="Incomer" && deviceName !="INCOMER") {
          const projectId = device.projectId;
          const projectName = projects[projectId]?.name;

          const mode1 = device.latestDataByModeId.filter((itm, index) => {
            return itm.modeId == 1;
          });

          const mode1Val = mode1 && mode1[0];
          const dailyKwh = mode1Val?.parameters.filter((itm, ind) => {
            return itm.key == "102";
          });
  
          const dailyKwhValue = dailyKwh && dailyKwh[0].value;
  
          const val = {
          projectName: projectName,
          deviceName: deviceName,
          dailyKwh: dailyKwhValue,
          };
          ddd.push(val);
        }
        }
      else {

      if (deviceName != "Incomer" && "INCOMER" && deviceName !=" to servo stabilizer " )
      {
         
        const projectId = device.projectId;
       
        const projectName = projects[projectId]?.name;

        const mode1 = device.latestDataByModeId.filter((itm, index) => {
          return itm.modeId == 1;
        });

        const mode1Val = mode1 && mode1[0];
        const dailyKwh = mode1Val?.parameters.filter((itm, ind) => {
          return itm.key == "102";
        });


        const dailyKwhValue = dailyKwh && dailyKwh[0].value;

        const val = {
          projectName: projectName,
          deviceName: deviceName,
          dailyKwh: dailyKwhValue,   
        };
        ddd.push(val);
      }
    }
      const data = ddd.sort((a, b) => b.dailyKwh - a.dailyKwh).slice(0, 5);
      setKWhData(data);
    }
  };

  useEffect(() => {
    if (JSON.stringify(devicesById) !== "{}") {
      localStorage.setItem("devicesById", JSON.stringify(devicesById));
      setDevicesByIdd(devicesById);
      getAllData(devicesById);
    } else {
      const dta = localStorage.getItem("devicesById");
      setDevicesByIdd(JSON.parse(dta));
      getAllData(JSON.parse(dta));
    }
    // getAllData(devicesById);
  }, [devicesById]);


  return (<>

  {dataFormat === "table" && 
    <div className="kwhCont">
        <div className="kwhsm">
          <h4>Top 5 Weekly Kwh Consumptions </h4>
          <div className="kwhbox">
            <div className="kwhsmbox">
              <h6>Sr No.</h6>
              <h6>Device </h6>
              <h6>Project</h6>
              <h6>Weekly Kwh</h6>
            </div>

            {kwhData.map((itm, index) => {
              
              return (
                <>
                  <div className="kwhsmbox" key={index}>
                    <h5>{index + 1}</h5>
                    <h5>{itm.deviceName} </h5>
                    <h5>{itm.projectName}</h5>
                    <h5>{itm.dailyKwh}</h5>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>}

      {dataFormat === "graph" && <WeeklyKwhGraphConsumptions kwhData={kwhData}/>}
      </>)
}
export default WeeklyKwhConsumptions;