// src/components/common/AddButton.js
import React from 'react';
import { Button } from 'antd';

const AddButton = ({ title, onClick }) => {
    return (
        <Button type="primary" onClick={onClick}>
            {title}
        </Button>
    );
};

export default AddButton;
