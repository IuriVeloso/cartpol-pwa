import React, { useState, useRef, LegacyRef, useMemo, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  CircularProgress,
  Grid,
  Paper,
  styled,
  Button,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogContent,
  FormControlLabel,
  Switch,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
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
  useGetStateVotes,
} from "../../hooks/index";

import { Political, County, PoliticalTypes, State } from "../../api/types";

import Shapefile from "./components/Shapefile";
import SelectValues from "./components/SelectValues";

import { zipCountyUrl, zipStateUrl } from "../../assets/maps";

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
          <Item elevation={1}>
            <SelectValues
              disabled={!Boolean(year)}
              value={state}
              isLoading={isLoadingState}
              values={allStates}
              onChange={handleChangeState}
              label="Estado"
            />
          </Item>
          <FormHelperText
            variant="standard"
            disabled={false}
            id="standard-helperText"
          >
            Deixar em branco para ver o mapa do Brasil
          </FormHelperText>
        </Grid>

        <Grid xs={6}>
          <Item elevation={1}>
            <SelectValues
              disabled={!Boolean(state)}
              value={county}
              isLoading={isLoadingCounty}
              values={searchCounties as County[]}
              onChange={handleChangeCounty}
              label="Municipio (Opcional)"
            />
          </Item>
          <FormHelperText
            variant="standard"
            disabled={false}
            id="standard-helperText"
          >
            Deixar em branco para ver o mapa do Estado
          </FormHelperText>
        </Grid>
        <Grid xs={3}>
          <Item>
            <SelectValues
              disabled={!Boolean(state)}
              value={politicalType}
              isLoading={isLoadingPoliticalTypes}
              values={searchPoliticalTypes as PoliticalTypes[]}
              onChange={handleChangePoliticalType}
              label="Cargo"
            />
          </Item>
        </Grid>
        <Grid xs={6}>
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
          xs={3}
        >
          <Button
            variant="contained"
            disabled={!shouldRenderMap}
            endIcon={
              isLoadingGenerateReport ? (
                <CircularProgress
                  color="inherit"
                  size="20px"
                  className="generateButton"
                />
              ) : (
                <DownloadIcon />
              )
            }
            onClick={() => mutateGenerateReport()}
            color="black"
          >
            Gerar Relatório
          </Button>
        </Grid>
        <Grid className="switch">
          <FormControlLabel
            control={
              <Switch
                defaultChecked
                checked={hasNeighborhood}
                onChange={() => setHasNeighborhood(!hasNeighborhood)}
              />
            }
            label="Mostrar porcentagens por bairro"
          />
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
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {(isLoadingVotes || isLoadingStateVotes) && (
            <div>
              Carregando mapa...
              <br />
              <CircularProgress sx={{ mt: "128px" }} size={80} />
            </div>
          )}
          {shouldRenderMap && (
            <>
              <Shapefile
                setVotesInfo={setVotesInfo}
                zipUrl={zipUrl}
                zipUrlState={zipUrlState}
                politicalData={politicalVotes}
                stateData={stateVotes}
                legendType={legendType}
              />
              <Dialog open={openDialog} disablePortal>
                <DialogContent>
                  Passe o cursor em cima dos polígonos para ver o resultado do
                  bairro
                </DialogContent>
              </Dialog>
            </>
          )}
        </MapContainer>
      </Grid>
      <Grid item key="map-info" minWidth={"180px"} xs={2}>
        <Item>
          <FormControl fullWidth>
            <InputLabel disabled={!shouldRenderMap}>Indice</InputLabel>
            <Select
              label="Índice do Mapa"
              onChange={(e) => {
                setLegendType(e.target.value);
                // mapRef.current?.remove();
              }}
              value={legendType}
            >
              <MenuItem value="rcan_uesp">RCAN_UESP</MenuItem>
              <MenuItem value="ruesp_can">RUESP_CAN</MenuItem>
            </Select>
          </FormControl>
        </Item>
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
