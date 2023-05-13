import React from "react";
import PropTypes from 'prop-types';

const ParameterInfo = props => {
  const { name, unit, value } = props;

  return (
    <div className="w-full h-full p-4 bg-light rounded-lgw-full h-full bg-light rounded-lg flex items-center justify-center">
        <div>
          <div className="text-cardHeading font-medium text-center">{name} { unit ? `- ${unit}` : null }</div>
          <div className="text-cardHeading text-dark font-bold text-center">{value}</div>
        </div>
    </div>
  );
}

ParameterInfo.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]).isRequired
};

export default ParameterInfo;
