import { useState, useEffect } from 'react';
import { Container, Navbar, NavbarBrand } from 'reactstrap';
import { BasicField, PageFields, PageInfo } from './types/types';
import './App.css';

function App() {
  const [tableData, setTableData]: [BasicField[], any] = useState([]);
  const [pages, setPagesData]: [PageInfo|null, any] = useState(null);

  useEffect(() => {
    async function loadData() {
      const resp: Response = await fetch('/fields?page=1&succeed');
      const geoData: PageFields = await resp.json();
      // const geoData = await resp.text();

      console.log(geoData);

      if (geoData && 'fields' in geoData) {
        setTableData(geoData['fields']);
      }

      if (geoData && 'pages' in geoData) {
        setPagesData(geoData['pages']);
      }
    }

    loadData();
  }, []);

  return (
    <div className="bg-dark full-page">
      <Navbar color="dark" dark>
        <NavbarBrand href="/">Geo App</NavbarBrand>
      </Navbar>
      <Container className="" fluid="lg">

      </Container>
    </div>
  );
}

export default App;
