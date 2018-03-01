
import React from 'react';
import ReactDOM from 'react-dom';
import Status from '../common/status';
import {StatusService} from "./pages/statusService";


if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

const status = new Status("test");
status.dependencies.push({status: "ok", description: "bd of the service"});
status.status = "warning";
ReactDOM.render(

  <StatusService status={status}/>,
  document.body
);

