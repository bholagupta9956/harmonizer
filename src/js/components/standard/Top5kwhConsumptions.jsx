import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../styles/top5Consumption.css";
import DailyKwhConsumptions from "./DailyKwhConsumptions.jsx";
import WeeklyKwhConsumptions from "./WeeklyKwhConsumptions.jsx";
import MonthlyKwhConsumptions from "./MonthlyKwhConsumptions.jsx";

const Top5kwhConsumptions = (props) => {

  const { devicesById } = props;
  const { isLoading, projects } = useSelector((state) => state.projects);

  const [consumption, setConsumption] = useState("daily");
  const [dataFormat, setShowFormat] = useState("table");

  return (
    <>
      <div className="top5Cont">
        <div className="top5BtnCont">
          <div className="top5Btn">
            <h6
              onClick={() => setConsumption("daily")}
              style={{
                background: consumption === "daily" && "#26a64e",
                color: consumption === "daily" && "white",
              }}
            >
              Daily
            </h6>
            <h6
              onClick={() => setConsumption("weekly")}
              style={{
                background: consumption === "weekly" && "#26a64e",
                color: consumption === "weekly" && "white",
              }}
            >
              Weekly
            </h6>
          </div>
          <div className="top5Btn">
            <h6
              onClick={() => setShowFormat("table")}
              style={{
                background: dataFormat === "table" && "#26a64e",
                color: dataFormat === "table" && "white",
              }}
            >
              Table
            </h6>
            <h6
              onClick={() => setShowFormat("graph")}
              style={{
                background: dataFormat === "graph" && "#26a64e",
                color: dataFormat === "graph" && "white",
              }}
            >
              Graph
            </h6>
          </div>
        </div>
        
        {consumption === "daily" && 
          <DailyKwhConsumptions
            projects={projects}
            devicesById={devicesById}
            dataFormat={dataFormat}
          />
        }

        {consumption === "weekly" && 
          <WeeklyKwhConsumptions
            projects={projects}
            devicesById={devicesById}
            dataFormat={dataFormat}
          />
        }

      </div>
    </>
  );
};

export default Top5kwhConsumptions;
