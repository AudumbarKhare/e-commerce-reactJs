// DynamicModal.js
import React from 'react';
import { Modal, Button } from 'antd';

const DynamicModal = ({ 
  visible, 
  onClose, 
  onSubmit, 
  title, 
  footerButtons, 
  children, 
  formValidation 
}) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onClose}
      footer={footerButtons || (
        <Button type='primary' onClick={onSubmit}>
          Submit
        </Button>
      )}
    >
      {children}
    </Modal>
  );
};

export default DynamicModal;
