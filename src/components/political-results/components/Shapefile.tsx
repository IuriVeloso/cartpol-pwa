import React, { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import shp, { FeatureCollectionWithFilename } from "shpjs";
import { PoliticalVotes } from "../../../api/types";

const Shapefile: React.FC<{
  zipUrl: string;
  politicalData: Array<PoliticalVotes>;
}> = ({ zipUrl, politicalData = [] }) => {
  const { map } = useLeafletContext();

  useEffect(() => {
    const geo = L.geoJson(
      { type: "Feature" },
      {
        onEachFeature: function popUp(f, l) {
          const out = [];
          if (f.properties) {
            for (const key in f.properties) {
              out.push(key + ": " + f.properties[key]);
            }
            l.bindPopup(out.join("<br />"));
          }
        },
        bubblingMouseEvents: false,
        style: function (feature) {
          if (Boolean(politicalData.length)) {
            const neighborhood = politicalData.find(
              (eachData) =>
                eachData.neighborhood === feature.properties.name_neigh,
            );

            if (Boolean(neighborhood?.total_votes)) {
              return {
                fillOpacity: neighborhood?.ruesp_can,
                fillColor: "#2500f7",
              };
            }
            return { fillOpacity: 0, fillColor: "#2500f7", weight: 0 };
          }
          return { fillOpacity: 0, fillColor: "#2500f7", weight: 0 };
        },
      },
    )
      .bindTooltip((e) => {
        if (!Boolean(politicalData.length)) {
          return `Bairro ${e.feature.properties.name_neigh}`;
        }

        const neighborhood = politicalData.find(
          (eachData) =>
            eachData.neighborhood === e.feature.properties.name_neigh,
        );

        if (Boolean(neighborhood)) {
          return `Bairro ${neighborhood?.neighborhood} <br/>Votos ${neighborhood?.total_votes}<br />RUESP_CAN ${neighborhood?.ruesp_can}`;
        }

        return `Bairro ${e.feature.properties.name_neigh} <br/>Votos 0`;
      })
      .addTo(map);

    shp(zipUrl).then((data) => {
      geo.addData(data as FeatureCollectionWithFilename);
    });
  }, [map, zipUrl, politicalData]);

  return null;
};

export default Shapefile;
