import React, { useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { GlobalFilter } from './GlobalFilter';
import ColumnFilterPopUp from './ColumnFilterPopUp';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import AddButton from '../AddButton';
import './table.css';

export const Tables = ({ data, columns, columnFilter = false, onAdd, saveBtnTitle = 'Add New Record',isSave=true,handleAddUser='' }) => {
    const defaultColumn = useMemo(() => ({
        Filter: ColumnFilterPopUp ? ColumnFilterPopUp : () => null
    }), [ColumnFilterPopUp]);

    const modifiedColumns = useMemo(() =>
        columns.map(col => ({
            ...col,
            getSortByToggleProps: col.id === 'actions' ? () => ({}) : col.getSortByToggleProps,
        })), [columns]);

    const tableInstance = useTable({
        columns: modifiedColumns,
        data,
        defaultColumn,
    }, useFilters, useGlobalFilter, useSortBy, usePagination);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state,
        setGlobalFilter,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize
    } = tableInstance;

    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                {isSave?(<AddButton title={saveBtnTitle} onClick={onAdd} />):<AddButton title={saveBtnTitle} onClick={handleAddUser} />}
                 {/* Add the button here */}
            </div>

            <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps()}
                                    style={{ border: '1px solid black', padding: '10px' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span
                                            {...(column.id !== 'actions' ? column.getSortByToggleProps() : {})}
                                            style={{ cursor: column.id !== 'actions' ? 'pointer' : 'default', flex: '1' }}
                                        >
                                            {column.render('Header')}
                                        </span>
                                        {column.id !== 'actions' && (
                                            <div
                                                {...column.getSortByToggleProps()}
                                                style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                            >
                                                {column.isSorted ? (
                                                    column.isSortedDesc ? (
                                                        <ArrowDownOutlined style={{ marginLeft: 8 }} />
                                                    ) : (
                                                        <ArrowUpOutlined style={{ marginLeft: 8 }} />
                                                    )
                                                ) : (
                                                    <>
                                                        <ArrowDownOutlined />
                                                        <ArrowUpOutlined />
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                            {column.canFilter ? column.render('Filter') : null}
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()} style={{ border: '1px solid black', padding: '10px' }}>
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <div>
                    <span>
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{' '}
                    </span>
                </div>
                <div>
                    <span>
                        Go to page:{' '}
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                                gotoPage(pageNumber);
                            }}
                            style={{ width: '50px' }}
                        />
                    </span>
                    <button disabled={pageIndex === 0} onClick={() => gotoPage(0)}>{'<<'}</button>
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Previous
                    </button>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        {[5, 10, 20, 30, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>

                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        Next
                    </button>
                    <button disabled={pageIndex === pageCount - 1} onClick={() => gotoPage(pageCount - 1)}>{'>>'}</button>
                </div>
            </div>

        </>
    );
};
