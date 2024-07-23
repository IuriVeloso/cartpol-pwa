import React, { useState } from "react";
import "./styles.css";
import { useGetStates } from "../../hooks/states";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
// import { Container } from './styles';

const Home: React.FC = () => {
  const { data, isLoading } = useGetStates();
  const [state, setState] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setState(event.target.value as string);
  };

  return (
    <div className="App">
      <Select
        labelId="select-states"
        id="select-states"
        value={state}
        onChange={handleChange}
      >
        {isLoading && <CircularProgress />}
        {data?.map((eachState) => (
          <MenuItem key={eachState.id} value={eachState.id}>
            {eachState.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default Home;
