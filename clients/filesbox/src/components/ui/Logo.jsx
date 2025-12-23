import { LuSquare } from "react-icons/lu";

export const Logo = ({
  className = "",
  style = {},
  size = 20,
  thickness = 1.5,
}) => {
  return (
    <LuSquare
      style={style}
      className={className}
      size={size}
      strokeWidth={thickness}
    />
  );
};
