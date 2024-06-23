import React, { useState } from 'react';
import { Layout } from 'antd';
import Headers from './common/header/Header';
import Sidebar from './common/sidebar/Sidebar';
import Breadcrumbs from './common/Breadcrumb';
import Contents from './common/Contents';

const Layouts = () => {
    const [isSidebarCollapsed, setSidebarCollased] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollased(!isSidebarCollapsed)
    }
    return (
        <Layout>
            <Headers />
            <Layout>
                <Sidebar collase={toggleSidebar} isCollase={isSidebarCollapsed} />
                <Layout
                    style={{
                        padding: '0 24px 24px',
                    }}
                >
                    <Breadcrumbs />
                    <Contents />
                </Layout>
            </Layout>
        </Layout>
    );
}

export default Layouts;
