import React from 'react';
// import { Home, AppstoreOutlined, DollarSign, UserPlus, BarChart, Settings, Archive, LogOut } from 'react-feather';
import { HomeOutlined, AppstoreOutlined, DollarCircleOutlined, UserAddOutlined, BarChartOutlined, SettingOutlined, InboxOutlined, LogoutOutlined } from '@ant-design/icons';

export const MENUITEMS = [
    { key: 'dashboard', label: 'Dashboard', icon: <HomeOutlined />, path: '/dashboard', type: 'link' },
    {
        key: 'sub2',
        label: 'Masters',
        icon: <AppstoreOutlined />,
        children: [
            { key: '5', label: 'BrandLogo', path: '/masters/brandlogo', type: 'link' },
            { key: '6', label: 'Category', path: '/masters/category', type: 'link' },
            { key:'9', label: 'Color', path: '/masters/color', type: 'link' },
            { key:'10', label: 'Tag', path: '/masters/tag', type: 'link' },
            { key:'11', label: 'Size', path: '/masters/size', type: 'link' },
            { key:'12', label: 'UserType', path: '/masters/usertype', type: 'link' }
        ],
    },
    {
        key: 'sub3',
        label: 'Products',
        icon: <AppstoreOutlined />,
        children: [
            { key: '7', label: 'Product List', path: '/products/physical/product-list', type: 'link' },
            { key: '8', label: 'Add Product', path: '/products/physical/add-product', type: 'link' },
        ],
    },
    {
        key: 'sales',
        label: 'Sales',
        icon: <DollarCircleOutlined />,
        children: [
            { key: 'orders', label: 'Orders', path: '/sales/orders', type: 'link' },
            { key: 'transactions', label: 'Transactions', path: '/sales/transactions', type: 'link' },
        ],
    },
    {
        key: 'users',
        label: 'Users',
        icon: <UserAddOutlined />,
        children: [
            { key: 'list-user', label: 'User List', path: '/users/list-user', type: 'link' },
            { key: 'add-user', label: 'Add User', path: '/users/add-user', type: 'link' },
        ],
    },
    {
        key: 'settings',
        label: 'Settings',
        icon: <SettingOutlined />,
        children: [
            { key: 'profile', label: 'Profile', path: '/settings/profile', type: 'link' },
        ],
    },
    { key: 'reports', label: 'Reports', icon: <BarChartOutlined />, path: '/reports', type: 'link' },
    { key: 'invoice', label: 'Invoice', icon: <InboxOutlined />, path: '/invoice', type: 'link' },
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, path: '/auth/login', type: 'link' },
];
