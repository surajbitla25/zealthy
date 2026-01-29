import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">{children}</table>
    </div>
  );
};

export const TableHead: React.FC<TableProps> = ({ children }) => {
  return <thead className="bg-gray-50">{children}</thead>;
};

export const TableBody: React.FC<TableProps> = ({ children }) => {
  return <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
};

export const TableRow: React.FC<TableProps & { onClick?: () => void }> = ({
  children,
  onClick,
  className = '',
}) => {
  return (
    <tr
      onClick={onClick}
      className={`${onClick ? 'hover:bg-gray-50 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableHeader: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
};

export const TableCell: React.FC<TableProps> = ({ children, className = '' }) => {
  return <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>{children}</td>;
};
