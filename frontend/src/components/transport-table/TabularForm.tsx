import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import useStyles from './styles';

const NO_HAZARDS_KEY = '#14_T_NO_KNOWN_HAZARDS';
const CANNOT_DETECTED_TAG = '#14_T_CANNOT_DETECTED';

interface RawDataItem {
  tag: string;
  value: Array<{
    tag: string;
    default_literal: string;
    value: string | boolean;
    no_data_available: boolean;
    order_score: number;
  }>;
  default_literal: string;
  no_data_available: boolean;
  user_literal?: string;
}

interface TabularFormProps {
  data: RawDataItem[];
}

const TabularForm: React.FC<TabularFormProps> = ({ data }) => {
  const classes: any = useStyles();
  const [columns, setColumns] = React.useState<string[]>([]);
  const [rowData, setRowData] = React.useState<string[][]>([]);
  const [specialTags, setSpecialTags] = React.useState<Map<string, string>>(new Map());
  const [rowLiterals, setRowLiterals] = React.useState<string[]>([]);

  const rawDataToMatrix = (rawData: RawDataItem[]) => {
    const columns = rawData.map(item => item.tag);
    const rowMap = new Map<string, string[]>();
    const tempSpecialTags = new Map<string, string>();
    const specialRows = new Set<string>();
    const literals: string[] = [];

    rawData.forEach(({ value: valueItemList }, colIndex) => {
      valueItemList.forEach(({ tag, default_literal, value }) => {
        const rowValues = rowMap.get(default_literal) || Array(rawData.length).fill('');
        const isSpecialTag = tag === NO_HAZARDS_KEY || tag === CANNOT_DETECTED_TAG;

        rowValues[colIndex] = isSpecialTag
          ? typeof value === 'boolean' && value
            ? default_literal
            : ''
          : typeof value === 'string'
            ? value
            : '';

        if (isSpecialTag) {
          specialRows.add(default_literal);
        }

        if (isSpecialTag && typeof value === 'boolean' && value) {
          tempSpecialTags.set(`${colIndex}-${default_literal}`, tag);
        }

        rowMap.set(default_literal, rowValues);
      });
    });

    const rowData = Array.from(rowMap.entries()).map(([key, values]) => {
      literals.push(key);
      return [specialRows.has(key) ? '' : key, ...values];
    });

    setColumns(columns);
    setRowData(rowData);
    setSpecialTags(tempSpecialTags);
    setRowLiterals(literals);
  };

  const tableRender = () => {
    return (
      <TableContainer className={classes.tableContainer}>
        <Table aria-label="transport info table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell></TableCell>
              {columns.map((column, index) => (
                <TableCell className={classes.tableCell} key={index}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData.map((rowDataList, rowIndex) => (
              <TableRow key={rowIndex}>
                {rowDataList.map((cellData, cellIndex) => {
                  const isSpecial = cellIndex > 0 && specialTags.has(`${cellIndex - 1}-${rowLiterals[rowIndex]}`);
                  return (
                    <TableCell
                      sx={
                        cellIndex === 0
                          ? { minWidth: '20%' }
                          : isSpecial
                            ? { color: 'red' }
                            : {}
                      }
                      key={cellIndex}
                      className={cellIndex === 0 ? classes.tableHeader : ''}
                    >
                      {cellData}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  React.useEffect(() => {
    rawDataToMatrix(data);
  }, [data]);

  return tableRender();
};

export default TabularForm;