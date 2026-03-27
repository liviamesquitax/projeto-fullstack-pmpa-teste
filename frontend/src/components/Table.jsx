import { Children } from "react";

function Table({ columns, children, isLoading, emptyMessage }) {
  const hasRows = Children.count(children) > 0;
  const colSpan = columns.length;

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={colSpan} className="table-empty">
                Carregando...
              </td>
            </tr>
          )}
          {!isLoading && !hasRows && (
            <tr>
              <td colSpan={colSpan} className="table-empty">
                {emptyMessage}
              </td>
            </tr>
          )}
          {!isLoading && hasRows && children}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
