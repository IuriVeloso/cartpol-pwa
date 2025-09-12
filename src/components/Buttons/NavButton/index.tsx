import Button, { ButtonProps } from "@mui/material/Button/Button";
import React from "react";
import { formatClassName } from "utils/formatters/formatClassName";
import "./styles.css";

export type Props = ButtonProps & {
  text: string;
  href: string;
  className?: string;
};

const NavButton: React.FC<Props> = ({ text, href, className }) => {
  return (
    <Button href={href} className={formatClassName([className, "nav-button"])}>
      {text}
    </Button>
  );
};

export default NavButton;
