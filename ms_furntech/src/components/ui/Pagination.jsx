import React from "react";
import "./Pagination.scss";

const pageSizeOptions = [10, 20, 30];

const Pagination = ({ table, totalEntries = 0 }) => {
  const pageSizeSelectId = React.useId();
  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const currentPage = pageCount === 0 ? 0 : pageIndex + 1;
  const firstEntry = totalEntries === 0 ? 0 : pageIndex * pageSize + 1;
  const lastEntry = Math.min((pageIndex + 1) * pageSize, totalEntries);

  return (
    <div className="table-pagination">
      <div className="table-pagination__entries">
        <label htmlFor={pageSizeSelectId}>Show</label>
        <select
          id={pageSizeSelectId}
          value={pageSize}
          onChange={(event) => table.setPageSize(Number(event.target.value))}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>entries</span>
      </div>

      <div className="table-pagination__summary">
        Showing {firstEntry} to {lastEntry} of {totalEntries} entries
      </div>

      <div className="table-pagination__controls">
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {pageCount || 1}
        </span>
        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
