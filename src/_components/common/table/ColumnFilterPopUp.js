import React, { useState } from 'react';
import { Input, Popover } from 'antd';
import { FilterFilled } from '@ant-design/icons'; // Make sure to import the icon

function ColumnFilterPopUp({
    column: { filterValue, setFilter },
}) {
    const [visible, setVisible] = useState(false);

    const handleVisibleChange = (newVisible) => {
        setVisible(newVisible);
    };

    const content = (
        <Input
            value={filterValue || ''}
            onChange={(e) => {
                setFilter(e.target.value || undefined);
            }}
            placeholder="Search..."
        />
    );

    return (
        <Popover
            content={content}
            title="Filter"
            trigger="click"
            visible={visible}
            onVisibleChange={handleVisibleChange}
        >
            <FilterFilled type="primary" />
        </Popover>
    );
}

export default ColumnFilterPopUp;
