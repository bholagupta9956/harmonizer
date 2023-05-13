import React from "react";
import PropTypes from 'prop-types';
import { range } from 'lodash';

import LineChartV2 from './LineChartV2.jsx';

const ParameterInfoLineChart = props => {
  const { name, unit, value } = props;

  return (
    <div className="w-full h-full py-4 bg-light rounded-lgw-full h-full bg-light rounded-lg w-1/2 ">
      <div className="text-cardHeading font-medium">{name} { unit ? `- ${unit}` : null }</div>
      <LineChartV2
        labels={range(value.length)}
        datasets={
            [
                {
                label: name,
                borderColor: 'blue',
                data: value,
                fill: false,
                }
            ]
        }
      />
    </div>
  );
}

ParameterInfoLineChart.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]).isRequired
};

export default ParameterInfoLineChart;
