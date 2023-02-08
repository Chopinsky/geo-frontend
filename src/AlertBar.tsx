import { useState } from "react";
import { Message } from "./types/types";
import { Alert } from "reactstrap";

type AlertBarParams = {
  alert: Message | null;
  alertAction: () => void;
};

function AlertBars({ alert, alertAction }: AlertBarParams) {
  const [visible, setVisible] = useState(true);
  const onDismiss = () => {
    setVisible(false);
    alertAction();
  };

  if (!alert) {
    return null;
  }

  return (
    <Alert color={alert.level} isOpen={visible} toggle={onDismiss}>
      {alert.message}
    </Alert>
  );
}

export default AlertBars;
