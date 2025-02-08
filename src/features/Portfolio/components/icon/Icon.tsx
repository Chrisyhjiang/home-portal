import React from "react";

interface IconProps {
  icon: React.ComponentType<any>;
  [key: string]: any;
}

const Icon: React.FC<IconProps> = ({ icon: TheIcon, ...restProps }) => {
  return <TheIcon {...restProps} />;
};

export default Icon;
