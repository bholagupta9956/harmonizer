import PropTypes from 'prop-types';
import React from "react";

const Card = props => {
  const { children } = props;

  return (
    <div className="w-full p-4 bg-light  border-red-600 rounded-lg">
        {children}
    </div>
  );
}
Card.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]).isRequired
};

export default Card;

