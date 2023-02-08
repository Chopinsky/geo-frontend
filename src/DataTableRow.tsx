import Flag from "react-world-flags";
import GeoJSONArea from "@mapbox/geojson-area";
import { useEffect, useState } from "react";
import { baseUrl } from "./utils/utils";
import { BasicField, ExtendedField } from "./types/types";
import { GeoJSON } from "geojson";

type DataTableRowProps = {
  data: BasicField;
  columns: Array<string>;
  onExtraData: (f: ExtendedField) => void;
  onRowClick: (f: ExtendedField) => void;
};

const getIcon = (type: string) => {
  if (type === "corporate") {
    return "https://github.githubassets.com/images/icons/emoji/unicode/1f3e6.png";
  }

  if (type === "collective") {
    return "https://github.githubassets.com/images/icons/emoji/unicode/1f465.png";
  }

  return "https://github.githubassets.com/images/icons/emoji/unicode/1f464.png";
};

function DataTableRow({
  data,
  columns,
  onExtraData,
  onRowClick,
}: DataTableRowProps) {
  const { id, name, type } = data;
  const [fields, setFields] = useState<ExtendedField | null>(null);
  const [area, setArea] = useState<number>(0);

  const loadExtraData = () => {
    if (!id) {
      return;
    }

    const url = `${baseUrl}/fields/${id}?fast&succeed`;

    fetch(url, {
      mode: "cors",
    })
      .then((resp) => resp.json())
      .then((fields: ExtendedField) => {
        if (fields.geoData.type === "FeatureCollection") {
          const features = fields.geoData.features;
          const areaInSquaredMeters = GeoJSONArea.geometry(
            features[0].geometry
          );

          const areaInAcres =
            Math.round(0.000247105 * areaInSquaredMeters) / 100;

          setArea(areaInAcres);
          fields.area = areaInAcres;
        }

        // console.log(id, fields.geoData);
        setFields(fields);
        onExtraData(fields);
      })
      .catch((e) => {
        //todo: toast errors
        console.error(e);
      });
  };

  useEffect(() => loadExtraData(), [id]);

  const handleRowClick = () => {
    if (!fields) {
      loadExtraData();
    } else {
      onRowClick(fields);
    }
  };

  return (
    <tr key={id} onClick={() => handleRowClick()}>
      {columns.map((col) => {
        if (col === "type") {
          return (
            <td key={`${id}-type`}>
              <img src={getIcon(type)} alt={type} width="20" height="20" />
            </td>
          );
        }

        if (col === "country") {
          if (fields === null) {
            return <td></td>;
          }

          let countryCode = fields.countryCode;
          if (countryCode === "UK") {
            countryCode = "GB";
          }

          return (
            <td key={`${id}-country`}>
              <Flag
                code={countryCode}
                fallback={fields.countryCode}
                width="20"
                height="20"
              />
            </td>
          );
        }

        if (col === "area") {
          return <td key={`${id}-area`}>{`${area} acres`}</td>;
        }

        if (col === "name") {
          return <td key={`${id}-name`}>{name}</td>;
        }

        return <td></td>;
      })}
    </tr>
  );
}

export default DataTableRow;
