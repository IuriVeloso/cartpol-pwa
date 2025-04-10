import React, { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import shp, { FeatureCollectionWithFilename } from "shpjs";
import { PoliticalVotes } from "../../../api/types";
import { normalize } from "../../../utils/normalizer";

const Shapefile: React.FC<{
  zipUrl: string;
  zipUrlState: string;
  politicalData: PoliticalVotes | undefined;
  stateData: PoliticalVotes | undefined;
  setVotesInfo: (value: []) => void;
}> = ({ zipUrl: zipUrlCounty, zipUrlState, politicalData, stateData, setVotesInfo }) => {
  const { map } = useLeafletContext();

  useEffect(() => {

    const voteData = politicalData || stateData;
    const zipUrl = zipUrlCounty || zipUrlState;
    const isState = Boolean(zipUrlState) && Boolean(stateData);
    const localKey = isState ? "county" : "neighborhood";

    if(!voteData || !zipUrl) {
      return;
    }

    const { votes, min_ruesp_can, max_ruesp_can } = voteData;

    const foundLocals = votes.map((eachVotes) => ({
      ...eachVotes,
      foundMap: false,
    }));

    const geo = L.geoJson(
      { type: "Feature" },
      {
        onEachFeature: function popUp(f, l) {
          if (f.properties) {
            const name_subdistrict =
              f.properties.NM_BAIRRO ||
              f.properties.NM_SUBDIST ||
              f.properties.NM_DIST || 
              f.properties.name_neigh || 
              f.properties.name_subdi || 
              f.properties.name_distr ||
              f.properties.NM_MUN;
            
            const localIndex = foundLocals.findIndex(
              (eachData) =>
                eachData[localKey].length &&
                !eachData[localKey].localeCompare(name_subdistrict, undefined, { sensitivity: 'base' }),
            );
            if (localIndex !== -1) {
              foundLocals[localIndex].foundMap = true;
              const local = foundLocals[localIndex];

              const mapText = `Bairro ${local?.[localKey]} <br/>Votos ${local?.total_votes}<br />% do candidato: ${(Math.round(local?.ruesp_can * 10000) / 100).toFixed(2)}<br />% do bairro: ${(Math.round(local?.rcan_uesp * 10000) / 100).toFixed(2)}<br />% do bairro na cidade ${(Math.round(local?.ruesp * 10000) / 100).toFixed(2)}`;

              l.bindTooltip(mapText);
              l.bindPopup(mapText);
            } else {
              l.bindTooltip(`Bairro ${name_subdistrict} <br/>Votos 0`);
              l.bindPopup(`Bairro ${name_subdistrict} <br/>Votos 0`);
            }

            setVotesInfo(foundLocals);
          }
        },
        bubblingMouseEvents: false,
        style: function (feature) {
          if (Boolean(votes.length)) {
            const name_subdistrict =
              feature.properties.NM_BAIRRO ||
              feature.properties.NM_SUBDIST ||
              feature.properties.NM_DIST|| 
              feature.properties.name_neigh || 
              feature.properties.name_subdi || 
              feature.properties.name_distr ||
              feature.properties.NM_MUN;

              const local = votes.find(
              (eachData) => !eachData[localKey].localeCompare(name_subdistrict, undefined, { sensitivity: 'base' }),
            );

            if (Boolean(local?.total_votes)) {
              return {
                fillOpacity: normalize(
                  local?.ruesp_can,
                  min_ruesp_can,
                  max_ruesp_can,
                ),
                fillColor: "#100069",
                weight: 1,
              };
            }
          }
          return { fillOpacity: 0, fillColor: "#100069", weight: 1 };
        },
      },
    ).addTo(map);

    shp(zipUrl).then((data) => {
      const geoJSON = geo.addData(data as FeatureCollectionWithFilename);
      map.fitBounds(geoJSON.getBounds());
      L.control.attribution({ prefix: "CartPol" }).addTo(map);
    });
  }, [map, zipUrlCounty, zipUrlState, politicalData, stateData, setVotesInfo]);

  return null;
};

export default Shapefile;
