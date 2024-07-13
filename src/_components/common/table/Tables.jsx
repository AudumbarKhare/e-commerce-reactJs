import React, { useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { GlobalFilter } from './GlobalFilter';
import { ColumnFilter } from './ColumnFilter';

export const Tables = ({ data, columns, columnFilter = false }) => {
    const defaultColumn = useMemo(() => ({
        Filter: columnFilter ? ColumnFilter : () => null
    }), [columnFilter]);

    const tableInstance = useTable({
        columns,
        data,
        defaultColumn,
    }, useFilters, useGlobalFilter, useSortBy, usePagination);

    const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow, state, setGlobalFilter,
        nextPage, previousPage, canPreviousPage, canNextPage, pageOptions, gotoPage, pageCount, setPageSize } = tableInstance;

    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ border: '1px solid black', padding: '10px' }}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                    </span>
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
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
            <div style={{ marginTop: '20px' }}>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
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
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[10, 20, 30, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    Previous
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    Next
                </button>
            </div>
        </>
    );
};
