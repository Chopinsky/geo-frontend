import { useState, useEffect } from "react";
import { Table } from "reactstrap";
import { BasicField, ExtendedField, DataSrcType } from "./types/types";
import DataTableRow from "./DataTableRow";
import TableModal from "./TableModal";

type DataTableProps = {
  data: BasicField[] | null;
};

const buildHeader = (columns: Array<string>) => {
  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={`th-${col}`}>{col ? col.toUpperCase() : ""}</th>
        ))}
      </tr>
    </thead>
  );
};

function DataTable({ data }: DataTableProps) {
  const [rows, setRows] = useState<DataSrcType>({});
  const [displayRows, setDisplayRows] = useState<Array<string>>([]);
  const [modal, setModal] = useState<ExtendedField | null>(null);

  const columns = ["name", "type", "country", "area"];
  const sortData: { [key: string]: ExtendedField } = {};

  // build rows and displayRows
  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }

    const orderedRows: Array<string> = [];
    const rowData: DataSrcType = {};

    data.forEach((r) => {
      orderedRows.push(r.id);
      rowData[r.id] = {
        id: r.id,
        name: r.name,
        type: r.type,
      };
    });

    setRows(rowData);
    setDisplayRows(orderedRows);
  }, [data]);

  const receiveExtraData = (f: ExtendedField) => {
    sortData[f.id] = f;
  };

  const handleRowClick = (f: ExtendedField) => {
    console.log(f);
    setModal(f);
  };

  return (
    <>
      <Table dark hover borderless striped size="sm">
        {buildHeader(columns)}
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
