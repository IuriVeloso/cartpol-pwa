import React, { useState, useRef, LegacyRef, useMemo } from "react";
import { MapContainer } from "react-leaflet";
import { SelectChangeEvent } from "@mui/material/Select";
import { CircularProgress, Grid, Paper, styled } from "@mui/material";
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
} from "../../hooks/index";

import { Political, County } from "../../api/types";

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

  const [state, setState] = useState("");
  const [county, setCounty] = useState("");
  const [political, setPolitical] = useState("");
  const [politicalType, setPoliticalType] = useState("");
  const [year, setYear] = useState("");

  const [votesInfo, setVotesInfo] = useState([]);

  const zipUrl: string = useMemo(
    () => (zipCountyUrl[county] ? zipCountyUrl[county] : null),
    [county],
  );

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
  } = useGetPoliticals(county, politicalType);

  const {
    data: searchPoliticalTypes,
    isPending: isLoadingPoliticalTypes,
    mutate: mutatePoliticalTypes,
  } = useGetPoliticalTypes(year);

  const { data: searchElections, isPending: isLoadingYears } = useGetYears();

  const {
    data: politicalVotes,
    isPending: isLoadingVotes,
    mutate: mutateVotes,
  } = useGetVotes(political);

  const handleChangeYear = (event: SelectChangeEvent) => {
    event.preventDefault();
    setYear(event.target.value as string);
    mutatePoliticalTypes();
    setPoliticalType("");
    setPolitical("");
  };

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

  const handleChangePoliticalType = (event: SelectChangeEvent) => {
    event.preventDefault();
    setPoliticalType(event.target.value as string);
    mutatePoliticals();
    setPolitical("");
  };

  const handleChangePolitical = (event: SelectChangeEvent) => {
    event.preventDefault();

    setPolitical(event.target.value);

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
      xs
      container
      rowSpacing={3}
    >
      <Grid
        className="results-screen"
        key="results-screen"
        xs={12}
        container
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
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
        <Grid xs={9}>
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
      </Grid>
      <Grid item key="map-container" xs={12}>
        <MapContainer
          zoomAnimation={true}
          fadeAnimation={true}
          style={{ height: "50vh" }}
          ref={mapRef}
          key={political}
          attributionControl={false}
          zoomDelta={0.5}
          zoomSnap={0.5}
          wheelPxPerZoomLevel={120}
        >
          {isLoadingVotes && <CircularProgress sx={{ mt: "40%" }} size={80} />}
          {shouldRenderMap && (
            <Shapefile
              setVotesInfo={setVotesInfo}
              zipUrl={zipUrl}
              politicalData={politicalVotes}
            />
          )}
        </MapContainer>
      </Grid>
      <div>
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
      </div>
    </Grid>
  );
};

export default PoliticalResults;
