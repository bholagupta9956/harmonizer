import React from "react";
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import Card from './Card.jsx';


const colorMap = {
    'warning': "rgba(246, 162, 30, 1)",
    'danger': "rgba(231, 17, 17, 1)",
    'regular': "rgba(38,166,78, 1)"
    
}

const 
GuageChartV3 = props => {
  const {
      name,
      value,
      unit,
      maxValue,
      minValue,

      isDanger,
      isWarning
  } = props;

  const valueCoefficient = ((maxValue - minValue)/maxValue)
  const correctedValue = valueCoefficient * value

  const emptyValue = maxValue - correctedValue;
  
  const activeColor = isDanger ? colorMap["danger"]
    : (isWarning ? colorMap["warning"] : colorMap["regular"]);

  const backgroundColor = "rgba(244, 245, 247, 1)"

    const data = {
        datasets: [{
            data: [correctedValue, emptyValue],
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
        <div className="w-full h-full py-4 bg-light rounded-lgw-full h-full bg-light rounded-lg w-1/2">
            <div className="text-cardHeading font-medium text-center">{name}</div>
            <Doughnut
                data={data}
                options={{
                    aspectRatio: 1,
                    tooltips: {
                        enabled: false
                    },
                    cutoutPercentage: 70,
                    animation: false,
                    maintainAspectRatio: true,
                    circumference: Math.PI,
                    rotation: Math.PI,
                }}
            />
            <div className="text-center  text-heading text-dark font-bold -mt-12">{value}</div>
            {
                unit && <div className="text-center font-bold text-dark">{unit}</div>
            }
        </div>
    );
}

GuageChartV3.defaultProps = {
    value: 60,
    maxValue: 100,
    isDanger: false,
    isWarning: false
};

GuageChartV3.propTypes = {
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

export default GuageChartV3;