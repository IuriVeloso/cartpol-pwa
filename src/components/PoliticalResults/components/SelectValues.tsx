import React from "react";

import { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { FormControl, FormHelperText } from "@mui/material";

import { State } from "../../../api/states/types";
import { County } from "../../../api/counties/types";
import { Political, PoliticalTypes } from "../../../api/politicals/types";
import { Election } from "../../../api/time/types";

interface SelectValuesInterface {
  values: State[] | County[] | Political[] | Election[] | PoliticalTypes[];
  onChange: (event: SelectChangeEvent) => void;
  isLoading: boolean;
  value: string;
  label: string;
  disabled: boolean;
  param?: string;
  helpText?: string;
}

const SelectValues: React.FC<SelectValuesInterface> = ({
  values = [],
  onChange,
  isLoading,
  value,
  label,
  disabled,
  helpText,
  param = "name",
}) => {

  return (
    <FormControl sx={{ minWidth: "100%" }} disabled={disabled}>
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
      {helpText && <FormHelperText variant="standard" disabled={false}  id="standard-helperText">{helpText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectValues;
