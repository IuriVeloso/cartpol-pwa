import React from "react";

import { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { FormControl, FormHelperText } from "@mui/material";
import { County, Political, PoliticalTypes, State } from "api/types";
import { Election } from "api/time/types";
import "./styles.css";
import { formatClassName } from "utils/formatters/formatClassName";

interface SelectValuesInterface {
  values: State[] | County[] | Political[] | Election[] | PoliticalTypes[];
  onChange: (event: SelectChangeEvent) => void;
  isLoading?: boolean;
  value: string | null;
  label: string;
  disabled: boolean;
  param?: string;
  helpText?: string;
  className?: string;
}

const SelectValues: React.FC<SelectValuesInterface> = ({
  values = [],
  onChange,
  isLoading,
  value,
  label,
  disabled,
  className,
  helpText,
  param = "name",
}) => {
  return (
    <FormControl
      sx={{ minWidth: "100%" }}
      disabled={disabled}
      className={formatClassName([className, "select"])}
    >
      <Autocomplete
        disablePortal
        disabled={disabled}
        value={value}
        options={values}
        onChange={onChange}
        loading={isLoading}
        loadingText="Carregando..."
        clearText="Limpar"
        openText="Abrir"
        closeText="Fechar"
        noOptionsText="Nenhum resultado encontrado"
        getOptionLabel={(opt) => opt[param]}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
      {helpText && (
        <FormHelperText
          variant="standard"
          disabled={false}
          id="standard-helperText"
        >
          {helpText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectValues;
