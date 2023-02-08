import Flag from "react-world-flags";
import GeoJSONArea from "@mapbox/geojson-area";
import { useEffect, useState } from "react";
import { baseUrl } from "./utils/utils";
import { RowDataSrcType, ExtendedField, MessageType } from "./types/types";
import { serializeToPoints } from "./utils/svgUtils";

type DataTableRowProps = {
  data: RowDataSrcType;
  columns: Array<string>;
  onExtraData: (f: ExtendedField | MessageType) => void;
  onRowClick: (f: ExtendedField | MessageType) => void;
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
  let { id, name, type } = data;
  const [fields, setFields] = useState<ExtendedField | MessageType | null>(
    null
  );
  const [area, setArea] = useState<number>(0);
  const [svgPath, setSvgPath] = useState<string>("");

  const loadExtraData = () => {
    if (!id) {
      return;
    }

    const url = `${baseUrl}/fields/${id}?fast`;

    fetch(url, {
      mode: "cors",
    })
      .then((resp: Response) => resp.json())
      .then((fields: ExtendedField | MessageType) => {
        if (fields && "message" in fields) {
          // this is a loading error
          return;
        }

        if (
          fields.geoData &&
          typeof fields.geoData !== "string" &&
          fields.geoData.type === "FeatureCollection"
        ) {
          const features = fields.geoData.features;
          const geometry = features[0].geometry;

          if (geometry.type === "Polygon") {
            const svg = serializeToPoints(geometry.coordinates[0], 20);
            setSvgPath(svg);
            // console.log(geometry, svg);
          }

          const areaInSquaredMeters = GeoJSONArea.geometry(geometry);

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
          let farmType = typeof type === "string" ? type : "";
          return (
            <td key={`${id}-type`}>
              <img
                src={getIcon(farmType)}
                alt={farmType}
                width="20"
                height="20"
              />
            </td>
          );
        }

        if (col === "country") {
          if (fields === null) {
            return <td key={`${id}-country`}></td>;
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

        if (col === "shape") {
          return (
            <td key={`${id}-shape`}>
              <svg height="20" width="20">
                <polygon
                  points={svgPath}
                  style={{ fill: "grey", stroke: "grey", strokeWidth: 1 }}
                />
              </svg>
            </td>
          );
        }

        return <td key={`${id}`}></td>;
      })}
    </tr>
  );
}

export default DataTableRow;
