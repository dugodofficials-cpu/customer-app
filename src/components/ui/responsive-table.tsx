import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ReactNode, useState, useMemo } from 'react';

export interface TableColumn<T> {
  header: string;
  field: keyof T | ((item: T) => ReactNode);
  mobileField?: keyof T | ((item: T) => ReactNode);
  hideOnMobile?: boolean;
  maxWidth?: string | number;
}

interface ResponsiveTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  mobileLayout?: (item: T) => ReactNode;
  rowsPerPage?: number;
  page?: number;
  onPageChange?: (event: React.ChangeEvent<unknown>, value: number) => void;
  showPagination?: boolean;
}

export default function ResponsiveTable<T>({
  columns,
  data,
  emptyMessage = 'No data found',
  mobileLayout,
  rowsPerPage = 10,
  page: controlledPage,
  onPageChange: controlledOnPageChange,
  showPagination = true,
}: ResponsiveTableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [internalPage, setInternalPage] = useState(1);

  const page = controlledPage ?? internalPage;
  const onPageChange =
    controlledOnPageChange ??
    ((_: React.ChangeEvent<unknown>, value: number) => setInternalPage(value));

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    if (!showPagination || rowsPerPage <= 0) return data;
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, page, rowsPerPage, showPagination]);

  if (isMobile && mobileLayout) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {paginatedData.length === 0 ? (
          <Typography
            sx={{ color: '#FFF', fontFamily: 'space-grotesk', textAlign: 'center', py: 4 }}
          >
            {emptyMessage}
          </Typography>
        ) : (
          paginatedData.map((item, index) => <Box key={index}>{mobileLayout(item)}</Box>)
        )}
        {showPagination && data.length > rowsPerPage && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={onPageChange}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#fff',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minWidth: '40px',
                  height: '40px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#2AC318',
                    borderColor: '#2AC318',
                    '&:hover': {
                      backgroundColor: '#2AC318',
                    },
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        borderRadius: '0.5rem',
        border: '1px solid #2AC318',
      }}
    >
      <Table
        sx={{
          minWidth: '100%',
          backgroundColor: '#151515',
          borderRadius: '0.5rem',
          '& th': {
            backgroundColor: '#2C2C2C !important',
            color: '#FFF',
            fontFamily: 'space-grotesk',
            fontSize: '1rem',
            padding: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          },
          '& td': {
            color: '#FFF',
            fontFamily: 'space-grotesk',
            fontSize: '0.875rem',
            padding: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            wordBreak: 'break-word',
          },
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((column, index) =>
              !isMobile || !column.hideOnMobile ? (
                <TableCell
                  key={index}
                  sx={{
                    backgroundColor: '#2C2C2C !important',
                    maxWidth: column.maxWidth || 'none',
                    overflow: column.maxWidth ? 'hidden' : 'visible',
                    textOverflow: column.maxWidth ? 'ellipsis' : 'clip',
                  }}
                >
                  {column.header}
                </TableCell>
              ) : null
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                <Typography sx={{ color: '#FFF', fontFamily: 'space-grotesk' }}>
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((item, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) =>
                  !isMobile || !column.hideOnMobile ? (
                    <TableCell
                      key={colIndex}
                      sx={{
                        maxWidth: column.maxWidth || 'none',
                        overflow: column.maxWidth ? 'hidden' : 'visible',
                        wordBreak: 'break-word',
                      }}
                    >
                      {typeof column.field === 'function'
                        ? column.field(item)
                        : String(item[column.field] || '-')}
                    </TableCell>
                  ) : null
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {showPagination && data.length > rowsPerPage && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
            py: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#fff',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minWidth: '40px',
                height: '40px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
                '&.Mui-selected': {
                  backgroundColor: '#2AC318',
                  borderColor: '#2AC318',
                  '&:hover': {
                    backgroundColor: '#2AC318',
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
