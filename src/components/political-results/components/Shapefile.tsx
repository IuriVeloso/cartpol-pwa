import React, { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import shp, { FeatureCollectionWithFilename } from "shpjs";

const Shapefile: React.FC<{ zipUrl: string }> = ({ zipUrl }) => {
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
      },
    )
      .bindTooltip((e) => {
        return `Bairro ${e.feature.properties.name_neigh}`;
      })
      .addTo(map);
    // console.log(zipUrl);

    shp(zipUrl).then((data) => {
      geo.addData(data as FeatureCollectionWithFilename);
    });
  }, [map, zipUrl]);

  return null;
};

export default Shapefile;
