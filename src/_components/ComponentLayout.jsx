import React from 'react'
import { Button, Flex, List, Skeleton, Typography } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
const listData = [
    {
        id: 1,
        name: 'Audumbar Khare'
    },
    {
        id: 2,
        name: 'Manisha Bhanavase'
    },
    {
        id: 3,
        name: 'Savata Survase'
    },
    {
        id: 4,
        name: 'Rudra Mali'
    },
    {
        id: 1,
        name: 'Firoz Bhagawan'
    }
]
const imgStyle = {
    display: 'block',
    width: 273,
}
const ComponentLayout = () => {
    return (
        <Flex justify='flex-start' style={{ height: '100%' }}>
            <List
                style={{
                    borderRight: '1px solid',
                    width: '25%',
                    height: '100%'
                }}
                size='small'
                dataSource={listData}
                renderItem={(item, index) => (
                    <List.Item
                        actions={[<a key="list-loadmore-edit" primary><EditFilled style={{color:'green'}}/></a>, <a danger key="list-loadmore-edit"><DeleteFilled style={{color:'red'}}/></a>]}
                    >
                        <List.Item.Meta
                            title={item.name}
                        />
                    </List.Item>
                )}
            />
            <Flex
                vertical
                style={{
                    paddingLeft: 32,
                    width: '75%'
                }}
            >
                <Typography.Title level={3}>
                    “antd is an enterprise-class UI design language and React UI library.”
                </Typography.Title>
                <Button type='primary'>
                    Get Started
                </Button>
            </Flex>
        </Flex>
    )
}

export default ComponentLayout;
