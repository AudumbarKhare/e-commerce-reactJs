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
            {/* <Breadcrumb.Item>
                <Link to="/dashboard">
                    Home
                </Link>
            </Breadcrumb.Item> */}
            {breadcrumbItems.map((breadcrumb, index) => (
                <Breadcrumb.Item key={index}>
                     {breadcrumb.label}
                    {/* {index !== breadcrumbItems.length - 1 ? (
                        <Link to={breadcrumb.link}>{breadcrumb.label}</Link>
                    ) : (
                        breadcrumb.label // No link for the current page
                    )} */}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    )
}

export default Breadcrumbs;
