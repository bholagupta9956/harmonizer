import React from "react";

import loginBG from '../../../images/bg/loginBG.jpg'

const LoginLayout = props => {
  return (
    <div
      className="bg-background min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `linear-gradient(rgba(38,166,78, 0.50), rgba(47,73,209, 0.50)))` }}
    >
      {props.children}
    </div>
  );
}

export default LoginLayout;