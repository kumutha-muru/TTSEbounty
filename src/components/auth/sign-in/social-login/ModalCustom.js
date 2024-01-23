import React from "react";
import { Modal } from "@mui/material";
import { CustomModalWrapper } from "../../../../styled-components/CustomStyles.style";

const ModalCustom = ({
  openModal,
  setModalOpen,
  children,
  disableAutoFocus,
}) => {

  const handleClose = (event, reason) => {
    if (reason && reason == "backdropClick") {
      if (disableAutoFocus) {
        return;
      } else {
        setModalOpen(false);
      }
    } else {
      setModalOpen(false);
    }
  };
  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableAutoFocus={disableAutoFocus}
        backDrop
      >
        <CustomModalWrapper>{children}</CustomModalWrapper>
      </Modal>
    </div>
  );
};
ModalCustom.propTypes = {};

export default ModalCustom;
