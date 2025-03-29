import React, { useState, useRef, LegacyRef, useMemo } from "react";
import { MapContainer } from "react-leaflet";
import { SelectChangeEvent } from "@mui/material/Select";
import { CircularProgress, Grid, Paper, styled, Button } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { Map } from "leaflet";

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
} from "../../hooks/index";

import { Political, County, PoliticalTypes, State } from "../../api/types";

import Shapefile from "./components/Shapefile";
import SelectValues from "./components/SelectValues";

import { zipCountyUrl } from "../../assets/maps";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  margin: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const PoliticalResults: React.FC = () => {
  const mapRef: LegacyRef<Map> = useRef(null);

  const [state, setState] = useState(null);
  const [county, setCounty] = useState(null);
  const [political, setPolitical] = useState(null);
  const [politicalType, setPoliticalType] = useState(null);
  const [year, setYear] = useState(null);

  const [votesInfo, setVotesInfo] = useState([]);

  const zipUrl: string = useMemo(
    () => (county && zipCountyUrl[county.id] ? zipCountyUrl[county.id] : null),
    [county],
  );

  const { data: allStates, isFetching: isLoadingState } = useGetStates();

  const {
    data: searchCounties,
    isPending: isLoadingCounty,
    mutate: mutateCounties,
  } = useGetCounties(state);

  const {
    isPending: isLoadingReport,
    mutate: mutateGenerateReport,
  } = useGetGenerateReport(year, political);

  const {
    data: searchPoliticals,
    isPending: isLoadingPolitical,
    mutate: mutatePoliticals,
  } = useGetPoliticals(county, politicalType, year);

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
  } = useGetVotes(political, county);

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

    mutateVotes();
  };

  const shouldRenderMap = useMemo(
    () =>
      Boolean(zipUrl) &&
      !isLoadingVotes &&
      politicalVotes &&
      Boolean(political),
    [zipUrl, isLoadingVotes, politicalVotes, political],
  );

  return (
    <Grid
      key="base-results"
      className="base-results"
      xs={12}
      container
      rowSpacing={3}
    >
      <Grid className="results-screen" key="results-screen" xs={12} container>
        <Grid xs={3}>
          <Item>
            <SelectValues
              disabled={false}
              value={year}
              isLoading={isLoadingYears}
              values={searchElections}
              onChange={handleChangeYear}
              label="Ano"
              param="year"
            />
          </Item>
        </Grid>
        <Grid xs={3}>
          <Item>
            <SelectValues
              disabled={!Boolean(year)}
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
              disabled={!Boolean(state)}
              value={county}
              isLoading={isLoadingCounty}
              values={searchCounties as County[]}
              onChange={handleChangeCounty}
              label="Municipio"
            />
          </Item>
        </Grid>
        <Grid xs={3}>
          <Item>
            <SelectValues
              disabled={!Boolean(county)}
              value={politicalType}
              isLoading={isLoadingPoliticalTypes}
              values={searchPoliticalTypes as PoliticalTypes[]}
              onChange={handleChangePoliticalType}
              label="Cargo"
            />
          </Item>
        </Grid>
        <Grid xs>
          <Item>
            <SelectValues
              disabled={!Boolean(politicalType)}
              value={political}
              isLoading={isLoadingPolitical}
              values={searchPoliticals as Political[]}
              onChange={handleChangePolitical}
              label="Politico"
            />
          </Item>
        </Grid>
        <Grid 
          item
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          xs="auto">
            <Button
              variant="contained" 
              loading={isLoadingVotes || isLoadingReport} 
              disabled={!shouldRenderMap} 
              endIcon={<DownloadIcon />}
              onClick={mutateGenerateReport}
              color="black"
              >
              Gerar Relatório
            </Button>
        </Grid>
      </Grid>
      <Grid item key="map-container" xs={12}>
        <MapContainer
          zoomAnimation={true}
          fadeAnimation={true}
          style={{ height: "50vh" }}
          ref={mapRef}
          key={political?.name}
          attributionControl={false}
          zoomDelta={0.5}
          zoomSnap={0.5}
          wheelPxPerZoomLevel={120}
        >
          {isLoadingVotes && (
            <CircularProgress sx={{ mt: "128px" }} size={80} />
          )}
          {shouldRenderMap && (
            <Shapefile
              setVotesInfo={setVotesInfo}
              zipUrl={zipUrl}
              politicalData={politicalVotes}
            />
          )}
        </MapContainer>
      </Grid>
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
    </Grid>
  );
};

export default PoliticalResults;
