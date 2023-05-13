import React, { useEffect, useState, useRef } from "react";
import { map, values, isEmpty } from "lodash";
import { StackedListContainer } from "../standard/StackedList.jsx";
import Maps, { Marker } from "../standard/Map.jsx";
import Button from "../standard/Button.jsx";
import Input from "../standard/Input.jsx";
import Alert from "../standard/Alert.jsx";
import StackedListItem from "../dynamic/StackedListItem.jsx";
import { searchFilter } from "../../../helpers/utils";
import Card from "../standard/Card.jsx";
import axios from "axios";
import DownloadableData from "../../containers/DownloadableData.jsx";
import { set, setDate } from "date-fns";
import { jsPDF } from "jspdf";
import $ from "jquery";
import DateObject from "react-date-object";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "../../../styles/deviceList.css";
import { useReactToPrint } from "react-to-print";
import Top5kwhConsumptions from "../standard/Top5kwhConsumptions.jsx";
import WeirMinerals from "../standard/WeirMinerals.jsx";


const DevicesList = (props) => {

  const {
    devices,
    devicesById,
    alerts,
    onViewDeviceDetails,
    onAddCustomDevice,
    projectId,
    projects,
  } = props;

  const [searchQuery, setSearchQuery] = useState();
  const [devicesView, setDevicesView] = useState("table");
  const [allDevicesId, setAllDevicesId] = useState([]);
  const [allDeviceData, setAllDeviceData] = useState([]);
  const [mmm, setMmm] = useState([]);
  const [id, setId] = useState("");
  const [allDeviceName, setAllDeviceName] = useState([]);
  const [startDate, setStartdate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allDatesArray, setAllDatesArray] = useState([]);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleSearchQuery = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchQuery(value);
  };

  // const displayDevices = devices; // isEmpty(filteredDevices) ? devices : filteredDevices;

  const results = searchFilter(
    values(devices),
    [
      "name",
      "deviceType",
      "prametersByModeId.modeValue",
      "prametersByModeId.modeName",
    ],
    searchQuery
  );

  const getdata1 = async () => {
    const allDevicesUrl = `https://rruok6m963.execute-api.ap-south-1.amazonaws.com/dev/project/${projectId}`;
    const data = await axios.get(allDevicesUrl);
    const dat = data.data[0]?.devices;
    return dat;
  };

  const getData2 = async (url) => {
    const res = await axios.get(url);
    const datt = res.data;
    return datt;
  };

  const ll = [2, 2, 2];

  const getDeviceDataByDate = async () => {
    setAllDeviceData([]);

    const data1 = await getdata1();

    for (var i = 0; i < data1.length; i++) {
      const deviceId = data1[i];
      const deviceName = devicesById[deviceId]?.name;
      setAllDeviceName((itm) => {
        return [...itm, deviceName];
      });

      var vallll = [];

      for (var j = 0; j < allDatesArray.length; j++) {
        const url = `https://rruok6m963.execute-api.ap-south-1.amazonaws.com/dev/project/${projectId}/device/${deviceId}/event?start_time=${allDatesArray[j]}T05:00:00Z&end_time=${allDatesArray[j]}T06:30:00Z`;

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

          const vall = {
            deviceName: deviceName,
            mode1: mode1data,
            mode0: mode0data,
            date: allDatesArray[j],
          };

          vallll.push(vall);
        }
      }

      setAllDeviceData((itm) => {
        return [...itm, vallll];
      });
    }
    setAllDatesArray([]);
    handlePrint();
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

  const handleStartDate = (val) => {
    setStartdate(val);
    setEndDate("");
  };

  const handleEndDate = async (val) => {
    setEndDate(val);
    const allDates = await getDates(startDate, val);

    await allDates.map((v, ins) => {
      const dd = v.toISOString().slice(0, 10);
      setAllDatesArray((itm) => {
        return [...itm, dd];
      });
    });
  };

  return (
    <>
      <div className="grid gap-4 grid-cols-4 md:grid-cols-8">
        <div className="order-2 col-span-6 md:order-1 md:col-span-2 row-span-4">
          {projectId != "6pEGd" && (
            <div className="w-full px-4 bg-light rounded-lg overflow-y-scroll">
              <div className="sticky top-0 py-4 bg-light text-subHeading text-dark font-bold">
                Alerts and Warnings
              </div>
              <div className="">
                {isEmpty(alerts) && (
                  <div className="p-4 bg-green-500 text-white">
                    No alerts reported
                  </div>
                )}
                {map(alerts, (alert) => {
                  return (
                    <Alert
                      key={`${alert.deviceId}-${alert.timestamp}`}
                      isWarning={alert.isWarning}
                      deviceId={alert.deviceId}
                      device={devicesById[alert.deviceId]?.name}
                      parameters={alert.parameters}
                      timestamp={alert.timestamp}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
        

        {projectId != "6pEGd" && (   <div className="order-1 md:order-2 col-span-6">
          <div className="w-full h-full p-4 bg-light rounded-lg overflow-y-scroll">
            
              <div className="flex gap-4">
                <select
                  value={devicesView}
                  className="block px-3 py-2 bg-background rounded outline-none"
                  onChange={(e) => setDevicesView(e.target.value)}
                >
                  <option value="map">Map</option>
                  <option value="table">Table</option>
                </select>
                <Button
                  isFullWidth={false}
                  label="+&nbsp;Add&nbsp;New&nbsp;Custom&nbsp;Equipment"
                  type="button"
                  onClick={onAddCustomDevice}
                />
                <Button
                  isFullWidth={false}
                  label=" Download"
                  type="button"
                  disabled={startDate === "" || endDate === ""}
                  onClick={getDeviceDataByDate}
                />
                <Input
                  isFullWidth={false}
                  placeholder="start date"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDate(e.target.value)}
                />

                <Input
                  isFullWidth={false}
                  placeholder="end date"
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndDate(e.target.value)}
                  disabled={startDate === ""}
                />
              </div>
           
            {projectId != "6pEGd" && (
              <>
                {devicesView == "map" && (
                  <Maps
                    defaultZoom={16}
                    width="100%"
                    height="400px"
                    // style={{ minHeight: 800 }}
                  >
                    {map(results, (device) => (
                      <div
                        key={device.deviceId}
                        onClick={() => handleDeviceClick(device)}
                        lat={device.lat}
                        lng={device.lng}
                        className="absolute h-10 w-10 -top-5 -left-5 rounded-full bg-primary-50 flex justify-center items-center"
                      >
                        <div className="h-4 w-4 rounded-full bg-primary" />
                      </div>
                    ))}
                  </Maps>
                )}
                { devicesView == "table" && (
                  <StackedListContainer heading="Equipments List">
                    <div className="p-2 border-b flex gap-x-2 items-center">
                      <Input
                        isFullWidth={false}
                        placeholder="Search ..."
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchQuery}
                      />
                      <select
                        value={searchQuery}
                        className="block px-3 py-2 bg-background rounded outline-none"
                        onChange={handleSearchQuery}
                      >
                        <option value="">All</option>
                        <option value="point_machine">Point Machine</option>
                        <option value="dc_track">DC Track</option>
                        <option value="signal">Signal</option>
                      </select>
                    </div>
                    {isEmpty(devices) && (
                      <div className="p-4 border-1">
                        This project dosent not have any devices.
                      </div>
                    )}

                    <div className="stackCont">
                      {map(results, (device, id) => {
                        const { latestDataByModeId } = device;
                        return (
                          <StackedListItem
                            key={device.deviceId}
                            id={device.deviceId}
                            type={device.deviceType}
                            name={device.name}
                            latestData={latestDataByModeId}
                            isAlert={device?.isAlert}
                            onClick={() => onViewDeviceDetails(device)}
                            devicesById={devicesById}
                          />
                        );
                      })}
                    </div>
                  </StackedListContainer>
                )}{" "}
              </>
            )}
            <div ref={componentRef}>
              <DownloadableData
                allDeviceData={allDeviceData}
                allDeviceName={allDeviceName}
                id="content"
              />
            </div>
            {startDate !== "" && endDate !== "" && (
              <Button
                isFullWidth={false}
                label="Print"
                type="button"
                onClick={handlePrint}
              />
            )}
          </div>
        </div> )}
      </div> 
      {projectId == "6pEGd" &&   <WeirMinerals projects={projects} devicesById={devicesById} />}
    </>
  );
};

export default DevicesList;
