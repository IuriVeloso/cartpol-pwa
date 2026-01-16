import React, { useState, useMemo, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { FormControlLabel, Switch, Box } from "@mui/material";

import "leaflet/dist/leaflet.css";
import "./styles.css";

import {
  useGetPoliticals,
  useGetPoliticalTypes,
  useGetCounties,
  useGetStates,
  useGetVotes,
  useGetYears,
  useGetGenerateReport,
  useGetStateVotes,
} from "../../hooks/index";

import { Political, County, PoliticalTypes, State } from "../../api/types";

import { zipCountyUrl, zipStateUrl } from "../../assets/maps";
import GenarateButton from "components/Buttons/GenerateButton";
import MapComponent from "components/PoliticalResults/components/MapContainer";
import SelectValues from "./components/SelectValues/SelectValues";

const PoliticalResults: React.FC = () => {
  const [state, setState] = useState(null);
  const [county, setCounty] = useState(null);
  const [political, setPolitical] = useState(null);
  const [politicalType, setPoliticalType] = useState(null);
  const [year, setYear] = useState(null);
  const [legendType, setLegendType] = useState("ruesp_can");
  const [openDialog, setOpenDialog] = useState(false);
  const [votesInfo, setVotesInfo] = useState([]);
  const [hasNeighborhood, setHasNeighborhood] = useState(false);

  const zipUrl: string = useMemo(
    () => (county && zipCountyUrl[county.id] ? zipCountyUrl[county.id] : null),
    [county],
  );

  const zipUrlState: string = useMemo(
    () => (state && zipStateUrl[state.id] ? zipStateUrl[state.id] : null),
    [state],
  );

  const { data: allStates, isFetching: isLoadingState } = useGetStates();

  const {
    data: searchCounties,
    isPending: isLoadingCounty,
    mutate: mutateCounties,
  } = useGetCounties(state);

  const { isPending: isLoadingReport, mutate: mutateGenerateReport } =
    useGetGenerateReport(year, political, county, state);

  const {
    data: searchPoliticals,
    isPending: isLoadingPolitical,
    mutate: mutatePoliticals,
  } = useGetPoliticals(county, politicalType, year, state);

  const {
    data: searchPoliticalTypes,
    isPending: isLoadingPoliticalTypes,
    mutate: mutatePoliticalTypes,
  } = useGetPoliticalTypes(year);

  const { data: searchElections, isFetching: isLoadingYears } = useGetYears();

  const {
    data: politicalVotes,
    isPending: isLoadingVotes,
    mutate: mutateVotes,
    reset: resetVotes,
  } = useGetVotes(political, county, hasNeighborhood);

  const {
    data: stateVotes,
    isPending: isLoadingStateVotes,
    mutate: mutateStateVotes,
    reset: resetStateVotes,
  } = useGetStateVotes(political, state, hasNeighborhood);

  const handleChangeYear = (event: SelectChangeEvent, value: any) => {
    event.preventDefault();
    setYear(value);
    mutatePoliticalTypes();
    setPoliticalType(null);
    setPolitical(null);
  };

  const handleChangeState = (event: SelectChangeEvent, value: State) => {
    event.preventDefault();
    setState(value);
    mutateCounties();
    setCounty(null);
    setPolitical(null);
  };

  const handleChangeCounty = (event: SelectChangeEvent, value: County) => {
    event.preventDefault();
    setCounty(value);
    mutatePoliticals();
    setPolitical(null);
  };

  const handleChangePoliticalType = (
    event: SelectChangeEvent,
    value: PoliticalTypes,
  ) => {
    event.preventDefault();
    setPoliticalType(value);
    mutatePoliticals();
    setPolitical(null);
  };

  const handleChangePolitical = (
    event: SelectChangeEvent,
    value: Political,
  ) => {
    event.preventDefault();

    setPolitical(value);
    setOpenDialog(true);

    if (county == null) {
      resetVotes();
      mutateStateVotes();
    } else {
      resetStateVotes();
      mutateVotes();
    }
  };

  const shouldRenderMap = useMemo(
    () =>
      (Boolean(zipUrl) || Boolean(zipUrlState)) &&
      !isLoadingVotes &&
      !isLoadingStateVotes &&
      (politicalVotes || stateVotes) &&
      Boolean(political),
    [
      zipUrl,
      zipUrlState,
      isLoadingVotes,
      isLoadingStateVotes,
      politicalVotes,
      stateVotes,
      political,
    ],
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (openDialog) {
      timer = setTimeout(() => {
        setOpenDialog(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [openDialog]);

  useEffect(() => {
    if (shouldRenderMap) {
      resetStateVotes();
      mutateVotes();
      setOpenDialog(true);
    }
    return;
  }, [hasNeighborhood]);

  const isLoadingGenerateReport =
    isLoadingVotes || isLoadingStateVotes || isLoadingReport;

  return (
    <Box component="form" className="base-results" key="base-results">
      <div className="grid">
        <SelectValues
          disabled={false}
          value={year}
          isLoading={isLoadingYears}
          values={searchElections}
          onChange={handleChangeYear}
          label="Ano"
          param="year"
          className="year"
        />
        <SelectValues
          disabled={!Boolean(year)}
          value={state}
          isLoading={isLoadingState}
          values={allStates}
          onChange={handleChangeState}
          label="Estado"
          className="state"
        />

        <SelectValues
          disabled={!Boolean(state)}
          value={county}
          isLoading={isLoadingCounty}
          values={searchCounties as County[]}
          onChange={handleChangeCounty}
          label="Municipio"
          className="county"
        />
        <SelectValues
          disabled={!Boolean(state)}
          value={politicalType}
          isLoading={isLoadingPoliticalTypes}
          values={searchPoliticalTypes as PoliticalTypes[]}
          onChange={handleChangePoliticalType}
          label="Cargo"
          className="role"
        />
        <SelectValues
          disabled={!Boolean(politicalType)}
          value={political}
          isLoading={isLoadingPolitical}
          values={searchPoliticals as Political[]}
          onChange={handleChangePolitical}
          label="Politico"
          className="political"
        />
        <GenarateButton
          disabled={!shouldRenderMap}
          onClick={() => mutateGenerateReport()}
          isLoading={isLoadingGenerateReport}
        />
      </div>
      {/* <FormControlLabel
        control={
          <Switch
            defaultChecked
            checked={hasNeighborhood}
            onChange={() => setHasNeighborhood(!hasNeighborhood)}
          />
        }
        label="Mostrar porcentagens por bairro"
        className="switch"
      /> */}
      <MapComponent
        legendType={legendType}
        openDialog={openDialog}
        key={political?.name}
        setVotesInfo={setVotesInfo}
        zipUrl={zipUrl}
        zipUrlState={zipUrlState}
        politicalVotes={politicalVotes}
        stateVotes={stateVotes}
        shouldRenderMap={shouldRenderMap}
        setLegendType={setLegendType}
        className="map"
      />

      {/* <div>
        <br />
        total votos contabilizados: {politicalVotes?.total_political_votes}
        <br />
        total votos exibidos:
        {votesInfo.reduce((accumulator, currentValue) => {
          if (currentValue.foundMap) {
            return accumulator + currentValue.total_votes;
          }
          return accumulator;
        }, 0)}
        <table>
          {votesInfo.map(
            (eachVotes) =>
              !eachVotes.foundMap && (
                <tr>
                  <th>{eachVotes.neighborhood}</th>
                  <th>{eachVotes.total_votes}</th>
                  <th>{eachVotes.ruesp}</th>
                </tr>
              ),
          )}
        </table>
      </div> */}
    </Box>
  );
};

export default PoliticalResults;
