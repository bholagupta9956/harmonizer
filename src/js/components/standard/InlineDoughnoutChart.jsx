import React from "react";
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';

import Card from './Card.jsx';

const colorMap = {
    'warning': "rgba(246, 162, 30, 1)",
    'danger': "rgba(231, 17, 17, 1)",
    'regular': "rgba(38,166,78, 1)"
}

const InlineDoughnoutChart = props => {
  const {
      name,
      value,
      unit,
      maxValue,

      isDanger,
      isWarning
  } = props;

  const emptyValue = maxValue - value;
  
  const activeColor = isDanger ? colorMap["danger"]
    : (isWarning ? colorMap["warning"] : colorMap["regular"]);

  const backgroundColor = "rgba(244, 245, 247, 1)"

    const data = {
        datasets: [{
            data: [value, emptyValue],
            borderWidth: 0,
            backgroundColor: [
                activeColor,
                backgroundColor
            ],
            hoverBackgroundColor: [
                activeColor,
                backgroundColor
            ]
        }]
    };

    return (
        <Card>
            <div className="flex items-center bg-light  mb-7  border-teal-500 h-10 justify-center gap-x-4">
                
                <div className="flex-none w-14 h-14 flex items-center justify-center mt-4">
                    {/* Graph Goes Here */}
                    <Doughnut
                        // height="300%"
                        data={data}
                        options={{
                            tooltips: {
                                enabled: false
                            },
                            cutoutPercentage: 50,
                            animation: false,
                            maintainAspectRatio: false,
                            // circumference: Math.PI,
                            // rotation: Math.PI,
                        }}
                    />
                </div>
                <div className="">
                    <div className="text-center text-heading text-dark font-bold mt-6">{value} { unit ? `${unit}` : null }</div>
                    <div className="text-center text-cardHeading font-medium text-center">{name} </div>
                </div>
            </div>
        </Card>
     
    );
}

InlineDoughnoutChart.defaultProps = {
    value: 60,
    maxValue: 100,
    isDanger: false,
    isWarning: false
};

InlineDoughnoutChart.propTypes = {
    size: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    maxValue: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    isDanger: PropTypes.bool,
    isWarning: PropTypes.bool
};

export default InlineDoughnoutChart;