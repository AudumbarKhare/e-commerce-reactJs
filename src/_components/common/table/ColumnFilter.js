import React from 'react';

export const ColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ''}
            onChange={e => setFilter(e.target.value || undefined)}
            placeholder={`Search ${count} records...`}
        />
    );
};
