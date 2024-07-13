import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

const { confirm } = Modal;

const capitalize = (colName) => {
    return colName.charAt(0).toUpperCase() + colName.slice(1);
};

const getColumns = (tableColumns, isAction, editRow, deleteRow) => {
    let columns = [];

    tableColumns.forEach(key => {
        let colName;
        switch (key) {
            case 'createdOn':
                colName = 'Created Date';
                break;
            case 'isSave':
                colName = 'Save Value';
                break;
            case 'imagePath':
                colName = 'Image';
                break;
            default:
                colName = key;
        }

        const commonProps = {
            Header: <b>{capitalize(colName)}</b>,
            accessor: key,
        };

        switch (key) {
            case 'imagePath':
                columns.push({
                    ...commonProps,
                    disableFilters: true,
                    Cell: ({ row }) => <img alt="image" src={row.original.imagePath} style={{ width: 50, height: 50 }} />,
                    sortable: false,
                });
                break;
            case 'orderStatus':
            case 'paymentStatus':
                columns.push({
                    ...commonProps,
                    Cell: ({ row }) => <div dangerouslySetInnerHTML={{ __html: row.original[key] }} />,
                    sortable: false,
                });
                break;
            default:
                columns.push(commonProps);
        }
    });

    if (isAction) {
        columns.push({
            Header: <b>Actions</b>,
            accessor: 'actions',
            disableFilters: true,
            Cell: ({ row }) => (
                <div>
                    <span
                        onClick={() => {
                            confirm({
                                title: 'Are you sure you want to delete this record?',
                                content: 'You will not be able to recover this record!',
                                okText: 'Yes, delete it!',
                                okType: 'danger',
                                cancelText: 'No, keep it',
                                onOk() {
                                    deleteRow(row.original.id);
                                },
                                onCancel() {
                                    console.log('Cancelled');
                                },
                            });
                        }}
                    >
                        <DeleteOutlined style={{ width: 35, color: 'red', cursor: 'pointer' }} />
                    </span>
                    <span
                        onClick={() => {
                            editRow(row.original);
                        }}
                    >
                        <EditOutlined style={{ width: 35, color: 'green', cursor: 'pointer' }} />
                    </span>
                </div>
            ),
        });
    }

    return columns;
};

export default getColumns;
