import React from 'react';
import { Layout, Menu, theme, Flex, Avatar, Dropdown } from 'antd';
import shopLogo from '../../../assets/Shop Logo.png';
import Audu from '../../../assets/audu.jpg'

const { Header } = Layout;

const Headers = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menu = (
        <Menu>
            <Menu.Item key="1">
                <a href="/profile">Profile</a>
            </Menu.Item>
            <Menu.Item key="2">
                <a href="/settings">Settings</a>
            </Menu.Item>
            <Menu.Item key="3">
                <a href="/logout">Logout</a>
            </Menu.Item>
        </Menu>
    );
    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                background: colorBgContainer,
            }}
        >
            <Flex align="center" justify="space-between" style={{ width: '100%' }}>
                <Avatar src={shopLogo} width={500} style={{ height: '50px', width: '50px', borderRadius: 0 }} />
                <Dropdown overlay={menu} trigger={['click']}>
                    <Avatar size="large" src={Audu}  />
                </Dropdown>
            </Flex>

        </Header>
    )
}

export default Headers;
