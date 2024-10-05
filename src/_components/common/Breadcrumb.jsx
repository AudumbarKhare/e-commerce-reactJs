import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter(i => i);

    const breadcrumbItems = [
        {
            label:'Home',
            link:'/'
        },
        ...pathSnippets.map((snippet,index)=>{
            const url = `/${pathSnippets.slice(0,index+1).join('/')}`;
            return {
                label:snippet.charAt(0).toUpperCase()+snippet.slice(1),
                link:url,
            };
        }),
    ];

    return (
        <Breadcrumb
            style={{
                margin: '16px 0',
            }}
        >
            {breadcrumbItems.map((breadcrumb, index) => (
                <Breadcrumb.Item key={index}>
                     {breadcrumb.label}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    )
}

export default Breadcrumbs;
