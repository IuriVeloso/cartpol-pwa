import Button, { ButtonProps } from "@mui/material/Button/Button";
import React from "react";
import { formatClassName } from "utils/formatters/formatClassName";
import "./styles.css";

export type Props = ButtonProps & {
  text: string;
  href?: string;
  className?: string;
  color?: string;
  disabled?: boolean;
  endIcon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const StyledButton: React.FC<Props> = ({
  text,
  href,
  className,
  color = "error",
  disabled,
  endIcon,
  onClick,
}) => {
  return (
    <Button
      href={href}
      variant="contained"
      color={color}
      className={formatClassName([className, "button"])}
      disabled={disabled}
      endIcon={endIcon}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default StyledButton;
