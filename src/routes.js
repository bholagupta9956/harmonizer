import React from "react";
import { HashRouter as Router, Switch } from "react-router-dom";
import PublicRoute from "./routesContainers/PublicRoute.jsx";
import PrivateRoute from "./routesContainers/PrivateRoute.jsx";
import AdminRoute from "./routesContainers/AdminRoute.jsx";
import ProjectDashboard from "./js/containers/ProjectDashboard.jsx";
import Projects from "./js/containers/Projects.jsx";
import DeviceDetails from "./js/containers/DeviceDetails.jsx";
import AddDevice from "./js/containers/AddDevice.jsx";
import Login from "./js/containers/Login.jsx";
import Signup from "./js/containers/Signup.jsx";
import Settings from "./js/containers/Settings.jsx";
import AddProject from "./js/containers/AddProject.jsx";
import AddCompany from "./js/containers/AddCompany.jsx";
import AddDeviceWizard from "./js/containers/AddDeviceWizard.jsx";
import UsersAndPermissions from "./js/containers/UsersAndPermissions.jsx";
import Companies from "./js/containers/Companies.jsx";
import AllDetails from "./js/containers/AllDetails.jsx";
import "chart.js/auto";

const Routes = () => {
  
  return (
    <Router>
      <Switch>
        <PublicRoute path="/signup" component={Signup} />
        <PublicRoute path="/login" component={Login} />
        <PrivateRoute path="/settings" component={Settings} />
        <AdminRoute path="/addProject" component={AddProject} />
        <AdminRoute path="/addCompany" component={AddCompany} />
        <AdminRoute path="/companies" component={Companies} />
        <AdminRoute path="/users" component={UsersAndPermissions} />
        <AdminRoute path="/config" component={AllDetails} />
        <PrivateRoute
          path="/:projectId/device/:deviceId"
          component={DeviceDetails}
        />
        <PrivateRoute path="/:projectId/addDevice" component={AddDevice} />
        <PrivateRoute
          path="/:projectId/addDeviceWizard"
          component={AddDeviceWizard}
        />
        <PrivateRoute path="/:projectId" component={ProjectDashboard} />
        <PrivateRoute path="/" component={Projects} />
      </Switch>
    </Router>
  );
};

export default Routes;
