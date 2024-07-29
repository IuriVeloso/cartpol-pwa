import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { useGetStates } from "../../hooks/states";
import { useGetCounties } from "../../hooks/counties";

import { SelectChangeEvent } from "@mui/material/Select";
import { useGetPoliticals } from "../../hooks/politicals";

import SelectValues from "./components/SelectValues";
import { Political } from "../../api/politicals/types";
import { County } from "../../api/counties/types";
import { Grid, Paper, styled } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  margin: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Home: React.FC = () => {
  const [state, setState] = useState("");
  const [county, setCounty] = useState("");
  const [political, setPolitical] = useState("");

  const { data: allStates, isLoading: isLoadingState } = useGetStates();
  const {
    data: searchCounties,
    isPending: isLoadingCounty,
    mutate: mutateCounties,
  } = useGetCounties(state);

  const {
    data: searchPoliticals,
    isPending: isLoadingPolitical,
    mutate: mutatePoliticals,
  } = useGetPoliticals(county);

  const handleChangeState = (event: SelectChangeEvent) => {
    event.preventDefault();
    setState(event.target.value as string);
    mutateCounties();
    setCounty("");
    setPolitical("");
  };

  const handleChangeCounty = (event: SelectChangeEvent) => {
    event.preventDefault();
    setCounty(event.target.value as string);
    mutatePoliticals();
    setPolitical("");
  };

  const handleChangePolitical = (event: SelectChangeEvent) => {
    event.preventDefault();
    setPolitical(event.target.value as string);
  };

  return (
    <div className="App base-background">
      <div className="base-box">
        <Grid container className="base-results">
          <Grid
            xs={6}
            container
            rowSpacing={{ xs: 1, sm: 2, md: 3 }}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            id="results-screen"
          >
            <Grid xs={6}>
              <Item>
                <SelectValues
                  value={state}
                  isLoading={isLoadingState}
                  values={allStates}
                  onChange={handleChangeState}
                  label="Estado"
                />
              </Item>
            </Grid>
            <Grid xs={6}>
              <Item>
                <SelectValues
                  value={county}
                  isLoading={isLoadingCounty}
                  values={searchCounties as County[]}
                  onChange={handleChangeCounty}
                  label="Municipio"
                />
              </Item>
            </Grid>
            <Grid xs>
              <Item>
                <SelectValues
                  value={political}
                  isLoading={isLoadingPolitical}
                  values={searchPoliticals as Political[]}
                  onChange={handleChangePolitical}
                  label="Politico"
                />
              </Item>
            </Grid>
          </Grid>
          <Grid xs={6}>Ola</Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Home;
