import React from "react";

import { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { FormControl } from "@mui/material";

import { State } from "../../../api/states/types";
import { County } from "../../../api/counties/types";
import { Political } from "../../../api/politicals/types";
import { Election } from "../../../api/time/types";

interface SelectValuesInterface {
  values: State[] | County[] | Political[] | Election[];
  onChange: (event: SelectChangeEvent) => void;
  isLoading: boolean;
  value: string;
  label: string;
  disabled: boolean;
  param?: string;
}

const SelectValues: React.FC<SelectValuesInterface> = ({
  values = [],
  onChange,
  isLoading,
  value,
  label,
  disabled,
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
        loadig={isLoading}
        getOptionLabel={(opt) => opt[param]}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </FormControl>
  );
};

export default SelectValues;
