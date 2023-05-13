// In this part we are writing code for the weir minerals project id // instead of project data we are showing some other data there ;

import React from "react";
import "../../../styles/weirMinerals.css";
import Top5kwhConsumptions from "./Top5kwhConsumptions.jsx";
import SevenDaysKwhData from "./SevenDaysKwhData.jsx";
import DailyKwhInPieChart from "./DailyKwhInPieChart.jsx";


const WeirMinerals = (props) => {

  return (
    <>
      <div className="wrMinerals">
        <div className="wrLeft">
          <SevenDaysKwhData {...props} />
        </div>
        <div className="wrRight">
          <Top5kwhConsumptions {...props} />
          {/* now adding a piechart to represent pcc data  */}
          <DailyKwhInPieChart {...props} />
        </div>
      </div>
    </>
  );
};

export default WeirMinerals;
