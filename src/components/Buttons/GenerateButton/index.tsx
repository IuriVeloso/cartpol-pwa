import React from "react";
import StyledButton from "../StyledButton";
import { CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export type Props = {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  className?: string;
};

const GenarateButton: React.FC<Props> = ({
  disabled,
  onClick,
  isLoading,
  className,
}) => {
  return (
    <StyledButton
      text="Gerar Relatório"
      disabled={disabled}
      className={className}
      endIcon={
        isLoading ? (
          <CircularProgress
            color="inherit"
            size="20px"
            className="generateButton"
          />
        ) : (
          <DownloadIcon />
        )
      }
      onClick={onClick}
      color="black"
    />
  );
};

export default GenarateButton;
