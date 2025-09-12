import Button, { ButtonProps } from "@mui/material/Button/Button";
import React from "react";

export type Props = ButtonProps & {
  text: string;
  href: string;
  className?: string;
};

const StyledButton: React.FC<Props> = ({ text, href, className }) => {
  return (
    <Button href={href} variant="contained" color="error" className={className}>
      {text}
    </Button>
  );
};

export default StyledButton;
