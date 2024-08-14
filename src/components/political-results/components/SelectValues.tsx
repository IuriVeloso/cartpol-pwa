import React from "react";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { FormControl, InputLabel } from "@mui/material";

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
  param?: string;
}

const SelectValues: React.FC<SelectValuesInterface> = ({
  values,
  onChange,
  isLoading,
  value,
  label,
  param = "name",
}) => {
  return (
    <FormControl sx={{ minWidth: "100%" }}>
      <InputLabel>{label}</InputLabel>
      <Select
        labelId="select-states"
        id="select-states"
        value={value}
        onChange={onChange}
        label={label}
      >
        {isLoading && <CircularProgress />}
        {values?.map((eachState) => (
          <MenuItem key={eachState.id} value={eachState.id}>
            {eachState[param]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectValues;
