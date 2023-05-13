import React, { useEffect, useState } from "react";
import {
  Switch,
  Route,
  NavLink,
  useLocation,
  useParams,
  useHistory,
  generatePath,
  useRouteMatch,
} from "react-router-dom";
import { filter, times, size } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import Skeleton from "react-loading-skeleton";
import {
  fetchDevicesDetailsUniversal,
  fetchDevicesDetailsRealTime,
} from "../../slices/devicesSlice.js";
import {
  fetchProjectsDetails,
  fetchProjectDetailsRealTime,
} from "../../slices/projectsSlice.js";
import { getAlertsByProject } from "../../slices/alertsSlice.js";
import { RagReportTable } from "../components/standard/RagReportTable.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import DevicesList from "../components/project-dashboard/DevicesList.jsx";
import Settings from "../components/project-dashboard/Settings.jsx";
import Card from "../components/standard/Card.jsx";
import ParameterInfo from "../components/standard/ParameterInfo.jsx";
import ParameterCard from "../components/dynamic/ParameterCard.jsx";
import { getIsSuperAdmin } from "../../helpers/auth";
import dayjs from "../../helpers/dayjs";
import de from "date-fns/esm/locale/de/index.js";
import { parse } from "date-fns/esm";


const ProjectDashboard = (props) => {

  const { userDetails } = props;
  const { search } = useLocation();
  const { path } = useRouteMatch();
  const searchParams = new URLSearchParams(search);
  const [drpListVal, setDrpListVal] = useState("0");
  const [incomer, setIncomer] = useState(0);
  const [allKwh, setAllKwh] = useState(0);
  const [current, setCurrent] = useState(0);
  const [allCurrent, setAllCurrent] = useState(0);
  const { projectId } = useParams();
  const history = useHistory();
  const { projects } = useSelector((state) => state.projects);
  const [alertsFilter, setAlertsFilter] = useState(
    searchParams.get("filterAlerts")
  );

  const {
    isLoading,
    devices: devicesById,
    devicesByProjectId,
  } = useSelector((state) => state.devicesDetails);

  const { isLoading: isProjectsLoading, projects: projectsById } = useSelector(
    (state) => state.projects
  );

  const { isLoading: isAlertsLoading, alertsByProjectId } = useSelector(
    (state) => state.alerts
  );

  const reloadTime = useSelector((state) => state.settings.reloadTime);
  const devices = devicesByProjectId[projectId]; // filter(allDevices, { projectId })

  const dispatch = useDispatch();

  useEffect(() => {
    const companyId = userDetails.companyId;
    const latestEndTime = dayjs();
    const latestStartTime = latestEndTime.subtract(24, "h");
    const end_time = latestEndTime.format("YYYY-MM-DDTHH:mm:ss");
    const start_time = latestStartTime.format("YYYY-MM-DDTHH:mm:ss");
    dispatch(fetchProjectsDetails(companyId));
    dispatch(fetchDevicesDetailsUniversal({ projectId }));
    dispatch(getAlertsByProject(projectId, start_time, end_time));
  }, []);

  useEffect(() => {
    const intervalTimer = setInterval(() => {
      dispatch(fetchDevicesDetailsRealTime(projectId));
      dispatch(fetchProjectDetailsRealTime(projectId));
    }, reloadTime);

    return () => clearInterval(intervalTimer);
    getData();
  }, [reloadTime]);

  useEffect(() => {
    if (devices && devices.length != 0) {
      setIncomer(0);
      setAllKwh(0);
      var dddd = 0;
      console.log(devices, "devices here");
      if (projectId != "QSiUZ") {
        for (var i = 0; i < devices.length; i++) {
          if (devices[i]?.name == "Incomer") {
            const val = devices[i];

            const filterbymode0 = val.latestDataByModeId.filter((itm) => {
              return itm.modeId == 0;
            });
            const modes = filterbymode0[0];
            const parameters = modes.parameters;

            var ddd = 0;
            for (var j = 0; j < parameters.length; j++) {
              if (parameters[j]?.key == "106") {
                const irVal = parameters[j].value;
                ddd = ddd + parseFloat(irVal);
              } else if (parameters[j]?.key == "107") {
                const iyVal = parameters[j].value;
                ddd = ddd + parseFloat(iyVal);
              } else if (parameters[j]?.key == "108") {
                const ibVal = parameters[j].value;
                setIncomer(ddd + parseFloat(ibVal));
              }
            }
          } else {
            const device = devices[i];
            const modes = device.latestDataByModeId;
            if (modes.length != 0) {
              for (var k = 0; k < modes.length; k++) {
                if (modes[k].modeId == "0") {
                  const parameters = modes[k]?.parameters;
                  for (var l = 0; l < parameters.length; l++) {
                    if (parameters[l]?.key == "106") {
                      const irVal = parameters[l].value;

                      setAllKwh(allKwh + parseFloat(irVal));
                      dddd += Number(irVal);
                    } else if (parameters[l]?.key == "107") {
                      const iyVal = parameters[l].value;

                      setAllKwh(allKwh + parseFloat(iyVal));
                      dddd += Number(iyVal);
                    } else if (parameters[l]?.key == "108") {
                      const ibVal = parameters[l].value;
                      dddd += Number(ibVal);
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        for (var i = 0; i < devices.length; i++) {
          if (devices[i].deviceId != "rFGR2") {
            if (devices[i]?.name == "Incomer") {
              const val = devices[i];
              console.log("hello");
              const filterbymode0 = val.latestDataByModeId.filter((itm) => {
                return itm.modeId == 0;
              });
              const modes = filterbymode0[0];
              const parameters = modes.parameters;

              var ddd = 0;
              for (var j = 0; j < parameters.length; j++) {
                if (parameters[j]?.key == "106") {
                  const irVal = parameters[j].value;
                  ddd = ddd + parseFloat(irVal);
                } else if (parameters[j]?.key == "107") {
                  const iyVal = parameters[j].value;
                  ddd = ddd + parseFloat(iyVal);
                } else if (parameters[j]?.key == "108") {
                  const ibVal = parameters[j].value;
                  setIncomer(ddd + parseFloat(ibVal));
                }
              }
            } else {
              const device = devices[i];
              const modes = device.latestDataByModeId;
              if (modes.length != 0) {
                for (var k = 0; k < modes.length; k++) {
                  if (modes[k].modeId == "0") {
                    const parameters = modes[k]?.parameters;
                    for (var l = 0; l < parameters.length; l++) {
                      if (parameters[l]?.key == "106") {
                        const irVal = parameters[l].value;

                        setAllKwh(allKwh + parseFloat(irVal));
                        dddd += Number(irVal);
                      } else if (parameters[l]?.key == "107") {
                        const iyVal = parameters[l].value;

                        setAllKwh(allKwh + parseFloat(iyVal));
                        dddd += Number(iyVal);
                      } else if (parameters[l]?.key == "108") {
                        const ibVal = parameters[l].value;
                        dddd += Number(ibVal);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      setAllKwh(dddd);
    }
    getCurrent();
  }, [devices, projectId]);

  const getCurrent = () => {
    if (devices && devices.length != 0) {
      setCurrent(0);
      setAllCurrent(0);

      var allCrntDta = 0;

      for (var i = 0; i < devices.length; i++) {
        if (devices[i]?.name == "Incomer") {
          const val = devices[i];
          const filterbymode0 = val.latestDataByModeId.filter((itm) => {
            return itm.modeId == 0;
          });
          const modes = filterbymode0[0];
          const parameters = modes.parameters;

          var ddd = 0;
          for (var j = 0; j < parameters.length; j++) {
            if (parameters[j]?.key == "103") {
              const irVal = parameters[j].value;
              ddd = ddd + parseFloat(irVal);
            } else if (parameters[j]?.key == "104") {
              const iyVal = parameters[j].value;
              ddd = ddd + parseFloat(iyVal);
            } else if (parameters[j]?.key == "105") {
              const ibVal = parameters[j].value;
              setCurrent(ddd + parseFloat(ibVal));
            }
          }
        } else {
          const device = devices[i];
          const modes = device.latestDataByModeId;

          if (modes.length != 0) {
            for (var k = 0; k < modes.length; k++) {
              if (modes[k].modeId == "0") {
                const parameters = modes[k]?.parameters;
                for (var l = 0; l < parameters.length; l++) {
                  if (parameters[l]?.key === "103") {
                    const irVal = parameters[l].value;
                    allCrntDta += Number(irVal);
                  } else if (parameters[l]?.key === "104") {
                    const iyVal = parameters[l].value;
                    allCrntDta += Number(iyVal);
                  } else if (parameters[l]?.key === "105") {
                    const ibVal = parameters[l].value;
                    allCrntDta += Number(ibVal);
                  }
                }
              }
            }
          }
        }
      }
      setAllCurrent(allCrntDta);
    }
  };

  if (isLoading || isProjectsLoading || isAlertsLoading) {
    return (
      <DashboardLayout>
        <div className="my-4 grid gap-4 grid-cols-2 xl:grid-cols-4  ">
          {times(4, (index) => (
            <Card key={index}>
              <div className="text-center">
                <div className="text-heading text-dark font-bold">
                  {" "}
                  <Skeleton />{" "}
                </div>
                <div className="text-cardHeading text-dark font-medium">
                  {" "}
                  <Skeleton />{" "}
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Skeleton height="50vh" />
        <div className="my-4">
          <Skeleton height="5vh" />
          <Skeleton height="20vh" />
          <Skeleton height="20vh" />
        </div>
      </DashboardLayout>
    );
  }

  const projectDetails = projectsById[projectId];
  const alerts = alertsByProjectId[projectId] || [];

  const handleViewDetails = (device) => {
    const path = generatePath("/:projectId/device/:deviceId", {
      projectId,
      deviceId: device.deviceId,
      devicesById,
    });
    history.push(path);
  };

  const handleAddCustomDevice = (e) => {
    e.preventDefault();
    const path = generatePath("/:projectId/addDeviceWizard", { projectId });
    history.push(path);
  };

  const handleFilter = (value) => {
    if (value == "alerts") {
      setAlertsFilter("1");
    } else {
      setAlertsFilter(null);
    }
  };

  const filteredDevices = filter(devices, (device) => {
    return alertsFilter && device?.meta?.isAlert;
  });

  const displayDevices = devices; // isEmpty(filteredDevices) ? devices : filteredDevices;

  const numberOfAlerts = size(filter(alerts, { isWarning: false }));
  const numberOfWarnings = size(filter(alerts, { isWarning: true }));

  return (
    <DashboardLayout>
      <div className="my-4 grid gap-4 grid-cols-4 md:grid-cols-8">
        <div className="col-span-4 md:col-span-8">
          <div className="p-4 bg-light rounded-lg flex items-center">
            <div className="text-subHeading text-dark font-bold">
              {projectDetails.name}
            </div>
          </div>
        </div>

        <div className="col-span-4 md:col-span-2 bg-light mb-0.5 flex items-center">
          {projectId != "6pEGd" && (
            <ParameterCard
              type="inline_doughnut_chart"
              name="Efficiency"
              value="100"
              maxValue="100"
              unit="%"
            />
          )}
        </div>

        <div className="col-span-4 md:col-span-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
            {projectId != "6pEGd" && (
              <>
                <ParameterCard
                  name="Number of Equipments"
                  value={size(devices)}
                />
                <ParameterCard name="Active Equipments" value={size(devices)} />
                {/* <ParameterCard name="Alerts" value={numberOfAlerts} />
                    <ParameterCard name="Warnings" value={numberOfWarnings} /> */}

                <ParameterCard
                  name="Incomers kW"
                  value={(incomer / 1000).toFixed(2)}
                />
                <ParameterCard
                  name="Total kW"
                  value={(allKwh / 1000).toFixed(2)}
                />
                <ParameterCard
                  name="Incomer Current"
                  value={current.toFixed(2)}
                />
                <ParameterCard
                  name="Total Current"
                  value={allCurrent.toFixed(2)}
                />
              </>
            )}
          </div>
        </div>

        {projectId != "6pEGd" && (
          <div className="col-span-4 md:col-span-8">
            <div className="py-4">
              <NavLink
                exact
                to={`/${projectId}`}
                activeClassName="active-link"
                className="p-4 bg-light text-primary cursor-pointer"
              >
                Equipment List
              </NavLink>
              <NavLink
                to={`/${projectId}/settings`}
                activeClassName="active-link"
                className="p-4 bg-light text-primary cursor-pointer"
              >
                Settings
              </NavLink>
            </div>
          </div>
        )}
        <div className="col-span-4 md:col-span-8">
          <Switch>
            <Route exact path={path}>
              <DevicesList
                devices={devices}
                devicesById={devicesById}
                alerts={alerts}
                onViewDeviceDetails={handleViewDetails}
                onAddCustomDevice={handleAddCustomDevice}
                projectId={projectId}
                projects={projects}
              />
            </Route>
            <Route path={`${path}/settings`}>
              <Settings />
            </Route>
          </Switch>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDashboard;
