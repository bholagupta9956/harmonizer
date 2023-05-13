import React, { useEffect, useReducer } from "react";
import { map, isEmpty } from "lodash"

import Alert from '../standard/AlertDetailed.jsx'
import Card from '../standard/Card.jsx'
import Button from "../standard/Button.jsx";
import Input from "../standard/Input.jsx";

function reducer(state, action) {
  switch (action.type) {
    case 'update-start-time':
        return { ...state, startTime: action.value };

    case 'update-end-time':
        return { ...state, endTime: action.value };
    
    case 'submit':
      return { ...state, endTime: action.value };

    default:
      throw new Error();
  }
}

const AlertsHistory = props => {

  const {
    isAlertsLoading,
    alerts,
    getAlertsOfDevice,
    initialTimestamp
  } = props

  const [state, reducerDispatch] = useReducer(reducer, initialTimestamp);

  const handleSubmit = e => {
    e.preventDefault()
    getAlertsOfDevice(state.startTime, state.endTime)
  }

  return (
    <>
      <div className="my-4">
        <Card>
            <form
              className="grid gap-4 grid-cols-1 md:grid-cols-3"
              onSubmit={handleSubmit}
            >
                <div>
                    <Input
                        value={state.startTime}
                        type="datetime-local"
                        label="Start Time"
                        onChange={e => reducerDispatch({ type: 'update-start-time', value: e.target.value })}
                    />
                </div>
                <div>
                    <Input
                        value={state.endTime}
                        type="datetime-local"
                        label="End Time"
                        onChange={e => reducerDispatch({ type: 'update-end-time', value: e.target.value })}
                    />
                </div>
                <div className="self-end">
                    <Button label="submit" type="submit" />
                </div>
            </form>
        </Card>
      </div>
      {
        isAlertsLoading && (
          <div className="my-4">
            Loading ...
          </div>
        )
      }
      {
        isEmpty(alerts) && !isAlertsLoading &&
        (
          <div className="p-4 bg-green-500 text-white">
            No alerts reported
          </div>
        )
      }
      {
        !isAlertsLoading && map(alerts, alert => (
          <Alert
            isWarning={alert.isWarning}
            key={`${alert.deviceId}-${alert.timestamp}`}
            device={alert.deviceId}
            project={alert.projectId}
            deviatedParams={alert.parameters}
            timestamp={alert.timestamp}
          />
        ))
      }
    </>
  );
}

export default AlertsHistory;
