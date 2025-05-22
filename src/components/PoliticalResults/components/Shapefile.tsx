import React, { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import L from "leaflet";
import shp, { FeatureCollectionWithFilename } from "shpjs";
import { PoliticalVotes } from "../../../api/types";

const Shapefile: React.FC<{
  zipUrl: string;
  zipUrlState: string;
  politicalData: PoliticalVotes | undefined;
  stateData: PoliticalVotes | undefined;
  setVotesInfo: (value: []) => void;
  legendType: string;
}> = ({ zipUrl: zipUrlCounty, zipUrlState, politicalData, stateData, setVotesInfo, legendType }) => {
  const { map } = useLeafletContext();

  useEffect(() => {
    L.control.attribution({ prefix: "CartPol" }).addTo(map);
  }, []);


  useEffect(() => {
    const voteData = politicalData || stateData;
    const zipUrl = zipUrlCounty || zipUrlState;
    const isState = Boolean(zipUrlState) && Boolean(stateData);
    const localKey = isState ? "county" : "neighborhood";
    const localName = isState ? "Município" : "Bairro";
    const localParentIndicator = isState ? "no Estado" : "no município";
    const legendValue = legendType === 'rcan_uesp' ? 'rcan_uesp' : 'ruesp_can';

    if(!voteData || !zipUrl) {
      return;
    }

    const { votes, min_ruesp_can, max_ruesp_can, min_rcan_uesp, max_rcan_uesp } = voteData;

    const min_value = legendType === 'rcan_uesp' ? min_rcan_uesp : min_ruesp_can;
    const max_value = legendType === 'rcan_uesp' ? max_rcan_uesp : max_ruesp_can;

    const quarter_value = (max_value - min_value)/6
    const intervalosEleicoes = [
      { min: min_value, max: (min_value+quarter_value), cor: '#ffffb2', label: "0-1% dos votos" },
      { min: (min_value+quarter_value), max: (min_value+2*quarter_value), cor: '#fed976', label: "1-2%" },
      { min: (min_value+2*quarter_value), max: (min_value+3*quarter_value), cor: '#feb24c', label: "2-5%" },
      { min: (min_value+3*quarter_value), max: (min_value+4*quarter_value), cor: '#fd8d3c', label: "1-2%" },
      { min: (min_value+4*quarter_value), max: (min_value+5*quarter_value), cor: '#f03b20', label: "2-5%" },
      { min: (min_value+5*quarter_value), max: (max_value+1), cor: '#bd0026', label: "5-10%" }
  ];

    const getColor = (value: number) => {
      const i = intervalosEleicoes.find(r => value >= r.min && value < r.max);
      return i ? i.cor : '#ffffb2';
    }

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

              const mapText = `${localName} ${local?.[localKey]} <br/>Votos ${local?.total_votes}<br />% do candidato: ${(Math.round(local?.ruesp_can * 10000) / 100).toFixed(2)}<br />% do ${localName.toLocaleLowerCase()}: ${(Math.round(local?.rcan_uesp * 10000) / 100).toFixed(2)}<br />% do ${localName.toLocaleLowerCase()} ${localParentIndicator} ${(Math.round(local?.ruesp * 10000) / 100).toFixed(2)}`;

              l.bindTooltip(mapText);
              l.bindPopup(mapText);
            } else {
              l.bindTooltip(`${localName} ${name_subdistrict} <br/>Votos 0`);
              l.bindPopup(`${localName} ${name_subdistrict} <br/>Votos 0`);
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
                fillOpacity: 1,
                fillColor: getColor(local?.[legendValue]),
                weight: 0.5,
              };
            }
          }
          return { fillOpacity: 1, fillColor: "#ffffb2", weight: 0.5 };
        },
      },
    ).addTo(map);


    const legend = L.control({ position: "bottomleft" });

    
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend');


      for (let i = 0; i < intervalosEleicoes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(intervalosEleicoes[i].min) + '"></i> ' +
              (Math.round( intervalosEleicoes[i].min * 10000) / 100).toFixed(2) + '%' + 
              (intervalosEleicoes[i + 1] ? '&ndash;' 
                + (Math.round( intervalosEleicoes[i].max * 10000) / 100).toFixed(2) + '% <br>' : '+');
      }

      return div;
    }

    legend.addTo(map);

    shp(zipUrl).then((data) => {
      const geoJSON = geo.addData(data as FeatureCollectionWithFilename);
      map.fitBounds(geoJSON.getBounds());
    });

    return () => {
      legend.remove();
      geo.remove();
    }
  }, [map, zipUrlCounty, zipUrlState, politicalData, stateData, setVotesInfo, legendType]);

  return null;
};

export default Shapefile;
