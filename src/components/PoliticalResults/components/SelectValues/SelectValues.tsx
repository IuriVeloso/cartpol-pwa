import React from "react";

import { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { FormControl } from "@mui/material";
import { County, Political, PoliticalTypes, State } from "api/types";
import { Election } from "api/year/types";
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
  className?: string;
  noOptionsText?: string;
}

const SelectValues: React.FC<SelectValuesInterface> = ({
  values = [],
  onChange,
  isLoading,
  value,
  label,
  disabled,
  className,
  noOptionsText = "Nenhum resultado encontrado",
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
        noOptionsText={noOptionsText}
        getOptionLabel={(opt) => opt[param]}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </FormControl>
  );
};

export default SelectValues;
