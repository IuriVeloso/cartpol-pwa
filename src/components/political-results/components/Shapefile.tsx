import React, { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import shp, { FeatureCollectionWithFilename } from "shpjs";
import { PoliticalVotes } from "../../../api/types";
import { normalize } from "../../../utils/normalizer";

const Shapefile: React.FC<{
  zipUrl: string;
  politicalData: PoliticalVotes;
}> = ({ zipUrl, politicalData }) => {
  const { map } = useLeafletContext();
  L.control.attribution({ prefix: "CartPol 2" }).addTo(map);

  useEffect(() => {
    const { votes_by_neighborhood, min_rcan_uesp, max_rcan_uesp } =
      politicalData;

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
          if (Boolean(votes_by_neighborhood.length)) {
            const neighborhood = votes_by_neighborhood.find(
              (eachData) =>
                eachData.neighborhood === feature.properties.name_neigh,
            );

            if (Boolean(neighborhood?.total_votes)) {
              return {
                fillOpacity: normalize(
                  neighborhood?.rcan_uesp,
                  min_rcan_uesp,
                  max_rcan_uesp,
                ),
                fillColor: "#100069",
              };
            }
            return { fillOpacity: 0, fillColor: "#100069", weight: 0 };
          }
          return { fillOpacity: 0, fillColor: "#100069", weight: 1 };
        },
      },
    )
      .bindTooltip((e) => {
        if (!Boolean(votes_by_neighborhood.length)) {
          return `Bairro ${e.feature.properties.name_neigh}`;
        }

        const neighborhood = votes_by_neighborhood.find(
          (eachData) =>
            eachData.neighborhood === e.feature.properties.name_neigh,
        );

        if (Boolean(neighborhood)) {
          return `Bairro ${neighborhood?.neighborhood} <br/>Votos ${neighborhood?.total_votes}<br />RUESP_CAN ${neighborhood?.ruesp_can}<br />RCAN_UESP ${neighborhood?.rcan_uesp}<br />RUESP ${neighborhood?.ruesp}`;
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
