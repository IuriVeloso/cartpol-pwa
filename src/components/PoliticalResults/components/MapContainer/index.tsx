import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";
import { Map } from "leaflet";
import React, { useRef, LegacyRef, Key } from "react";
import "./styles.css";

import Shapefile from "components/PoliticalResults/components/Shapefile";
import { PoliticalVotes } from "api/types";
import { formatClassName } from "utils/formatters/formatClassName";

export type Props = {
  key?: Key | null;
  isLoading?: boolean;
  shouldRenderMap?: boolean;
  setVotesInfo: React.Dispatch<React.SetStateAction<never[]>>;
  zipUrl: string;
  zipUrlState: string;
  politicalVotes?: PoliticalVotes;
  stateVotes?: PoliticalVotes;
  legendType: string;
  openDialog: boolean;
  setLegendType: (value: React.SetStateAction<string>) => void;
  className?: string;
};

const MapComponent: React.FC<Props> = ({
  key,
  isLoading,
  shouldRenderMap,
  setVotesInfo,
  stateVotes,
  zipUrl,
  zipUrlState,
  politicalVotes,
  openDialog,
  legendType,
  setLegendType,
  className,
}) => {
  const mapRef: LegacyRef<Map> = useRef(null);

  return (
    <Box className={formatClassName([className, "mapContainer"])}>
      <MapContainer
        zoomAnimation={true}
        fadeAnimation={true}
        style={{ height: "50vh" }}
        ref={mapRef}
        key={key}
        attributionControl={false}
        zoomDelta={0.5}
        zoomSnap={0.5}
        wheelPxPerZoomLevel={120}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {isLoading && (
          <div>
            Carregando mapa...
            <br />
            <CircularProgress sx={{ mt: "180px" }} size={50} color="inherit" />
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
      <FormControl fullWidth>
        <InputLabel disabled={!shouldRenderMap}>Índice do Mapa</InputLabel>
        <Select
          label="Índice do Mapa"
          onChange={(e) => {
            setLegendType(e.target.value);
            // mapRef.current?.remove();
          }}
          value={legendType}
          className="select"
        >
          <MenuItem value="rcan_uesp">RCAN_UESP</MenuItem>
          <MenuItem value="ruesp_can">RUESP_CAN</MenuItem>
        </Select>
      </FormControl>
      {/* substituir esse select pelo que já temos. Acrescentar modificações */}
    </Box>
  );
};

export default MapComponent;
