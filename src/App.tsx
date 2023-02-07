import { useState, useEffect } from "react";
import { Container, Navbar, NavbarBrand } from "reactstrap";
import { BasicField, PageFields, PageInfo } from "./types/types";
import "./App.css";
import Paginator from "./components/Paginator";

const baseUrl = "https://corteva-backend.zuodev.workers.dev";

function App() {
  const [tableData, setTableData]: [BasicField[], any] = useState([]);
  const [pages, setPagesData]: [PageInfo | null, any] = useState(null);

  const loadData = async () => {
    const url = `${baseUrl}/fields?page=1&fast`;

    const resp: Response = await fetch(url, {
      mode: "cors",
    });

    let geoData: PageFields | null = null;

    try {
      geoData = await resp.json();
    } catch (e) {
      console.error(e);
      return;
    }

    if (geoData && "fields" in geoData) {
      setTableData(geoData["fields"]);
    }

    if (geoData && "pages" in geoData) {
      setPagesData(geoData["pages"]);
    }
  };

  const pageClick = async (page: number | null) => {
    if (!page) {
      return;
    }

    console.log(page);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bg-dark full-page">
      <Navbar color="dark" dark>
        <NavbarBrand href="/">Geo App</NavbarBrand>
      </Navbar>
      <Container className="color-light" fluid="lg">
        <Paginator
          baseUrl={baseUrl}
          pages={pages}
          actions={(p) => pageClick(p)}
        />
      </Container>
    </div>
  );
}

export default App;
