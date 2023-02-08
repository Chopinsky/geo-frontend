import { Modal, ModalBody, ModalFooter, Button, List } from "reactstrap";
import { ExtendedField } from "./types/types";
import { Position } from "geojson";

type TableModalProps = {
  modal: ExtendedField | null;
  onClose: () => void;
};

function TableModal({ modal, onClose }: TableModalProps) {
  if (modal === null) {
    return null;
  }

  const { id, name, owner, type, countryCode, area, geoData } = modal;
  let coordinates: Position[][] = [];

  if (geoData.type === "FeatureCollection") {
    const geometry = geoData.features[0].geometry;
    if (geometry.type === "Polygon") {
      coordinates = geometry.coordinates;
    }
  }

  return (
    <Modal isOpen={!!modal} toggle={onClose}>
      <ModalBody>
        {modal ? (
          <List>
            <li>ID: {id}</li>
            <li>Name: {name}</li>
            <li>Owner: {owner}</li>
            <li>Type: {type}</li>
            <li>Country: {countryCode}</li>
            <li>Area: {area} Acre</li>
            {coordinates ? (
              <li>Coordinates: {JSON.stringify(coordinates)}</li>
            ) : null}
          </List>
        ) : (
          <h4>No modal data are provided</h4>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default TableModal;
