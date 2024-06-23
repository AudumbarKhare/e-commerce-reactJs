import React from 'react';
import { Button, Layout, Menu, theme } from 'antd';
import { MENUITEMS } from '../../../_constant/menu';
import { Link } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import UserProfile from './UserProfile';

const { Sider } = Layout
const { SubMenu } = Menu;

const Sidebar = ({ collase, isCollase }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const MenuItem = (item) => (
        <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.path}>{item.label}</Link>
        </Menu.Item>
    );

    const SubMenuItem = (subMenus) => (
        <SubMenu key={subMenus.key} icon={subMenus.icon} title={subMenus.label}>
            {subMenus.children.map(child =>
                child.children ? SubMenuItem(child) : MenuItem(child)
            )}
        </SubMenu>
    );

    return (
        <Sider
            width={200}
            style={{
                background: colorBgContainer,
                height: 'calc(100vh - 65px)'
            }}
            trigger={null}
            collapsible
            collapsed={isCollase}
        >
            <Menu
                mode="inline"
                style={{
                    height: '100%',
                    borderRight: 0,
                }}
                inlineCollapsed={isCollase}>
                <UserProfile />
                {MENUITEMS.map(item =>
                    item.children ? SubMenuItem(item) : MenuItem(item)
                )}

                <Button
                    type='text'
                    onClick={collase}
                    icon={isCollase ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    className='triger-btn'
                />
            </Menu>

        </Sider>
    )
}

export default Sidebar
