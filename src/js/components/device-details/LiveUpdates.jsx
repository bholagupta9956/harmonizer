import React, { useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { map, chain } from "lodash";
import BarGraph from "../../../../stories/BarGraph.stories.js";
import ParameterCard from "../standard/ParameterCard.jsx";
import ParameterInfoLineChart from "../standard/ParameterInfoGuageChart.jsx";
import ParameterInfo from "../dynamic/ParameterInfo.jsx";
import Card from "../standard/Card.jsx";

dayjs.extend(utc);

const LiveUpdates = (props) => {
  const {
    deviceDetails,
    reloadTime,
    getLiveDeviceDetails,
    projectId,
    devicesById,
    setWeeklyKwh,
  } = props;

  useEffect(() => {
    const intervalTimer = setInterval(getLiveDeviceDetails, reloadTime);
    return () => clearInterval(intervalTimer);
  }, [reloadTime]);

  return (
    <>
      {map(deviceDetails.latestDataByModeId, (modeData) => {
        return (
          <div className="my-4 border-t-2">
            {modeData.modeName && (
              <div className="my-4 grid gap-4 grid-cols-6">
                <div className="col-span-3 xl:col-span-2 p-4 bg-light rounded-lgw-full h-full bg-light rounded-lg flex items-center">
                  <div className="">
                    <div className="text-cardHeading font-medium">
                      Timestamp
                    </div>
                    <div className="text-cardHeading text-dark font-bold">
                      {dayjs
                        .utc(modeData.timestamp)
                        .format("HH:mm:ss DD MMM YYYY")}
                    </div>
                  </div>
                </div>
                <div className="col-span-3 xl:col-span-4 p-4 bg-light rounded-lgw-full h-full bg-light rounded-lg flex items-center">
                  <div>
                    <div className="text-cardHeading font-medium">
                      {modeData.modeName}
                    </div>
                    <div className="text-cardHeading text-dark font-bold">
                      {modeData.modeValue}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-6 xl:grid-cols-6">
              {chain(modeData.parameters)
                .sortBy("type")
                .map((param) => {
                  return <ParameterInfo {...param} />;
                })
                .value()}
            </div>
          </div>
        );
      })}
      <BarGraph
        projectId={projectId}
        deviceDetails={deviceDetails}
        setWeeklyKwh={setWeeklyKwh}
      />
    </>
  );
};

export default LiveUpdates;
