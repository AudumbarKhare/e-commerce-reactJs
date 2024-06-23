import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

const Breadcrumbs = () => {
    return (
        <Breadcrumb
            style={{
                margin: '16px 0',
            }}
        >
            <Breadcrumb.Item>
            <Link to="/dashboard">
                Home
            </Link>
            </Breadcrumb.Item>
        </Breadcrumb>
    )
}

export default Breadcrumbs;
