import { useState, useEffect } from "react";
import { Container, Navbar, NavbarBrand } from "reactstrap";
import { BasicField, PageFields, PageInfo, Message } from "./types/types";
import { baseUrl } from "./utils/utils";
import "./App.css";
import Paginator from "./Paginator";
import AlertBars from "./AlertBar";
import DataTable from "./DataTable";

function App() {
  const [tableData, setTableData] = useState<BasicField[]>([]);
  const [currPage, setCurrPage] = useState<number>(0);
  const [pages, setPagesData] = useState<PageInfo | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

  const loadPageData = async (page: number | null) => {
    // console.log("load page:", page, currPage);
    if (!page || isNaN(page) || page <= 0) {
      page = 1;
    }

    const url = `${baseUrl}/fields?page=${page}&fast`;
    const resp: Response = await fetch(url, {
      mode: "cors",
    });

    let geoData: PageFields | null = null;

    try {
      geoData = await resp.json();
      setMessage(null);
      // console.log(geoData);
    } catch (e) {
      setMessage({ level: "danger", message: JSON.stringify(e) });
      console.error(e);
      return;
    }

    if (
      geoData &&
      "message" in geoData &&
      typeof geoData["message"] === "string"
    ) {
      setMessage({ level: "danger", message: geoData["message"] });
      return;
    }

    if (geoData && "fields" in geoData) {
      setTableData(geoData["fields"]);
    }

    if (geoData && "pages" in geoData) {
      setPagesData(geoData["pages"]);
      setCurrPage(page);
    }
  };

  useEffect(() => {
    loadPageData(1);
  }, []);

  return (
    <div className="bg-dark full-page">
      <Navbar color="dark" dark>
        <NavbarBrand href="/">Geo App</NavbarBrand>
      </Navbar>
      <Container className="bg-dark container-custom" fluid="lg">
        {message ? (
          <AlertBars alert={message} alertAction={() => setMessage(null)} />
        ) : null}

        <Paginator
          pages={pages}
          actions={(p: number | null) => loadPageData(p)}
        />

        {tableData ? <DataTable data={tableData} /> : null}
      </Container>
    </div>
  );
}

export default App;
