import React, { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import shp, { FeatureCollectionWithFilename } from "shpjs";
import { PoliticalVotes } from "../../../api/types";
import { normalize } from "../../../utils/normalizer";

const Shapefile: React.FC<{
  zipUrl: string;
  politicalData: PoliticalVotes;
  setVotesInfo: (value: []) => void;
}> = ({ zipUrl, politicalData, setVotesInfo }) => {
  const { map } = useLeafletContext();

  useEffect(() => {
    const { votes_by_neighborhood, min_ruesp_can, max_ruesp_can } =
      politicalData;

    const foundNeighborhoods = votes_by_neighborhood.map((eachVotes) => ({
      ...eachVotes,
      foundMap: false,
    }));

    const geo = L.geoJson(
      { type: "Feature" },
      {
        onEachFeature: function popUp(f, l) {
          if (f.properties) {
            const name_subdistrict =
              f.properties.name_neigh ||
              f.properties.name_subdi ||
              f.properties.name_distr;

            const neighborhoodIndex = foundNeighborhoods.findIndex(
              (eachData) =>
                eachData.neighborhood.length &&
                eachData.neighborhood === name_subdistrict,
            );
            if (neighborhoodIndex !== -1) {
              foundNeighborhoods[neighborhoodIndex].foundMap = true;
              const neighborhood = foundNeighborhoods[neighborhoodIndex];

              const mapText = `Bairro ${neighborhood?.neighborhood} <br/>Votos ${neighborhood?.total_votes}<br />RUESP_CAN ${neighborhood?.ruesp_can}<br />RCAN_UESP ${neighborhood?.rcan_uesp}<br />RUESP ${neighborhood?.ruesp}`;

              l.bindTooltip(mapText);
              l.bindPopup(mapText);
            } else {
              l.bindTooltip(`Bairro ${f.properties.name_neigh} <br/>Votos 0`);
              l.bindPopup(`Bairro ${f.properties.name_neigh} <br/>Votos 0`);
            }

            setVotesInfo(foundNeighborhoods);
          }
        },
        bubblingMouseEvents: false,
        style: function (feature) {
          if (Boolean(votes_by_neighborhood.length)) {
            const name_subdistrict =
              feature.properties.name_neigh ||
              feature.properties.name_subdi ||
              feature.properties.name_distr;

            const neighborhood = votes_by_neighborhood.find(
              (eachData) => eachData.neighborhood === name_subdistrict,
            );

            if (Boolean(neighborhood?.total_votes)) {
              return {
                fillOpacity: normalize(
                  neighborhood?.ruesp_can,
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
  }, [map, zipUrl, politicalData, setVotesInfo]);

  return null;
};

export default Shapefile;
