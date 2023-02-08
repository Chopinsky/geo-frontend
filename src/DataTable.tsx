import { useState, useEffect, useMemo } from "react";
import { Table } from "reactstrap";
import { BasicField, ExtendedField, DataSrcType } from "./types/types";
import DataTableRow from "./DataTableRow";
import TableModal from "./TableModal";

type DataTableProps = {
  data: BasicField[] | null;
};

const buildHeader = (columns: Array<string>, onClick: (c: string) => void) => {
  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th onClick={() => onClick(col)} key={`th-${col}`}>
            {col ? col.toUpperCase() : ""}
          </th>
        ))}
      </tr>
    </thead>
  );
};

function DataTable({ data }: DataTableProps) {
  const [displayRows, setDisplayRows] = useState<Array<string>>([]);
  const [rows, setRows] = useState<DataSrcType>({});
  const [modal, setModal] = useState<ExtendedField | null>(null);
  const [sortInfo, setSortInfo] = useState<Array>(["", 0]);
  const [originalOrder, setOriginalOrder] = useState<Array<string>>([]);

  const columns = ["name", "type", "country", "area", "shape"];
  const sortData: { [key: string]: ExtendedField } = {};

  let sortCol: string = "";
  let sortDir: number = 0;

  // build rows and displayRows
  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }

    const orderedRows: Array<string> = [];
    const rowsData: DataSrcType = {};

    data.forEach((r) => {
      orderedRows.push(r.id);
      rowsData[r.id] = {
        id: r.id,
        name: r.name,
        type: r.type,
        country: "",
        area: 0,
      };
    });

    // save the original row orders
    setOriginalOrder([...orderedRows]);
    // console.log("original orders:", orderedRows);

    // update states
    setRows(rowsData);
    setDisplayRows(orderedRows);
  }, [data]);

  const receiveExtraData = (f: ExtendedField) => {
    rows[f.id] = f;
    setRows(rows);
  };

  const handleRowClick = (f: ExtendedField) => {
    // console.log(f);
    setModal(f);
  };

  const handleHeaderClick = (col) => {
    // not sortable
    if (col === "shape") {
      return;
    }

    // country => countryCode to comply with
    // with the fields name
    if (col === "country") {
      col = "countryCode";
    }

    let [sortCol, sortDir] = sortInfo;

    // sort a new column
    if (col !== sortCol) {
      sortCol = col;
      sortDir = 0;
    }

    // define sort orders, use state-machine
    // to toggle sorting directions
    if (sortDir === 0) {
      // asc
      sortDir = 1;
    } else if (sortDir === 1) {
      // desc
      sortDir = -1;
    } else {
      // original order
      sortDir = 0;
    }

    setSortInfo([sortCol, sortDir]);
    // console.log("sort:", col, sortCol, sortDir, rows);

    if (sortDir === 0) {
      // console.log("reset order:", originalOrder);
      setDisplayRows([...originalOrder]);
      return;
    }

    if (col === "country") {
      col = "countryCode";
    }

    displayRows.sort((i, j) => {
      const d0 = rows[i][col];
      const d1 = rows[j][col];
      if (d0 === d1) {
        return 0;
      }

      const order = d0 < d1 ? -1 : 1;
      return order * sortDir;
    });

    setDisplayRows([...displayRows]);
  };

  return (
    <>
      <Table dark hover borderless striped size="sm">
        {buildHeader(columns, (e) => handleHeaderClick(e))}
        <tbody>
          {displayRows.map((id) => (
            <DataTableRow
              data={rows[id]}
              columns={columns}
              onExtraData={(f) => receiveExtraData(f)}
              onRowClick={(f) => handleRowClick(f)}
              key={`row-${id}`}
            />
          ))}
        </tbody>
      </Table>
      <TableModal modal={modal} onClose={() => setModal(null)} />
    </>
  );
}

export default DataTable;
