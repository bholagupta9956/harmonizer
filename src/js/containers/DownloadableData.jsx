import React, { useState } from "react";
import "../../styles/downloadable.css";


const DownloadableData = (props) => {

  const {allDeviceData , allDeviceName } = props;
  const deviceData = allDeviceData;
  const projectName = localStorage.getItem("projectName");

  return (
    <div className="dnbCont" id={props.id}>
      {allDeviceData &&
        deviceData.map((itm, index) => {

          var totalKwh = 0;
          return (
            <>
              {itm && itm.length != 0 && (
                <div className="dnbDevice" key={index}>
                  <div className="dnbDvcDta">
                    <table border="1">
                      <tr className="dnvTitle">
                        <th style={{ border: "none" }} colSpan="5">
                         {projectName}  - {allDeviceName && allDeviceName[index]}
                        </th>
                      </tr>

                      <tbody >
                        <div style={{ display: "flex" }}>
                        <div className="title">
                          <h6>Date</h6>
                          <h6>kWh Daily</h6>
                          <h6>PF (Average)</h6>
                          <h6>Harmonics (THD-I-avg)</h6>
                          <h6>Harmonics (THD-W-avg)</h6>
                        </div>

                        {itm && itm.length != 0 &&
                          itm.map((itt, i) => {

                            const kwhDaily = itt?.mode1?.parameters.filter((itt) =>{
                              return itt.key === "101"
                            });

                            totalKwh = kwhDaily ?  (totalKwh + Number(kwhDaily[0].value)) : 0 ;
                            
                            const pfr = itt?.mode0?.parameters.filter(
                              (ittt) => {
                                return ittt.key === "112";
                              });

                            const pfrd = pfr &&  pfr.length != 0 && pfr[0]?.value
                               
                            const pfy = itt?.mode0?.parameters.filter(
                              (ittt) => {
                                return ittt.key === "113";
                              });

                              const pfyd = pfy && pfy.length !=0 && pfy[0]?.value;

                            const pfb = itt?.mode0?.parameters.filter(
                              (ittt) => {
                                return ittt.key === "114";
                              });

                              const pfbd = pfb &&  pfb.length != 0 && pfb[0]?.value

                              const pfAvg = (parseInt(pfrd) + parseInt(pfyd) + parseInt(pfbd)) / 3

                            const thdi = itt?.mode0?.parameters.filter(
                                (ittt) => {
                                  return ittt.key === "117";
                                }
                              );

                              const thdv = itt?.mode0?.parameters.filter(
                                (ittt) => {
                                  return ittt.key === "116";
                                }
                              );
                            
                            const key105 = itt?.mode0?.parameters.filter(
                              (ittt) => {
                                return ittt.key === "105";
                              }
                            );

                            return (
                              <>
                                <div className="data" key={i}>
                                  <h6>{itt && itt.date}</h6>
                                  <h6>{kwhDaily && kwhDaily[0]?.value.toFixed(2)}</h6>
                                  <h6>{pfAvg && pfAvg.toFixed(2)}</h6>
                                  <h6>{thdi && thdi[0]?.value}</h6>
                                  <h6>{thdv && thdv[0]?.value}</h6>
                                </div>
                              </>
                            );
                          })}
                          </div>
                          <div style={{display : "flex"}}>
                            <h6 className="titleh">Total Kwh Consumed</h6>
                            <h6 className="datah">{totalKwh.toFixed(2)}</h6>
                          </div>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          );
        })}
    </div>
  );
};

export default DownloadableData;
