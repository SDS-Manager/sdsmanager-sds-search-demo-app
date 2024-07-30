import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import useStyles from './styles';
import React from 'react';

const TabularForm = ({
  data }: {
    data: object;
    isEditable?: boolean
  }) => {
  const classes: any = useStyles();
  const [columns, setColumns] = React.useState<Array<string>>([]);
  const [rowData, setRowData] = React.useState<Array<Array<string>>>([]);
  const [isReRender, setIsReRender] = React.useState<boolean>(false);

  const rawDataToMatrix = (rawData: any) => {
    let columns: Array<string> = [];
    let rowMap = new Map();
    for (let index = 0; index < rawData.length; index++) {
      const element = rawData[index];
      columns.push(element["tag"])
      const valueItemList = element["value"];
      for (let i = 0; i < valueItemList.length; i++) {
        const valueItem = valueItemList[i];
        if (rowMap.has(valueItem["default_literal"])) {
          rowMap.get(valueItem["default_literal"]).push(valueItem["value"]);
        } else {
          rowMap.set(valueItem["default_literal"], [valueItem["value"]])
        }
      }
    }
    let rowData: Array<Array<string>> = [];
    rowMap.forEach((value, key) => {
      while (value.length < rawData.length) {
        value.push("");
      }
      rowData.push([key, ...value]);
    })

    setColumns(columns);

    setRowData(rowData);
    setIsReRender(!isReRender);

  }

  const tableRender = () => {
    return (
      <TableContainer className={classes.tableContainer}>
        <Table size="small" aria-label="table">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell></TableCell>
              {columns.map((keys, index) =>
              (
                <TableCell className={classes.tableCell} key={index}>
                  {keys}
                </TableCell>
              )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowData.map((rowDataList: Array<string>, key) => {
              return (<TableRow key={key}>
                {rowDataList.map((cellData: string, cellIndex: number) => {
                  return (
                    <TableCell style={{ width: '20%' }} key={cellIndex} className={cellIndex === 0 ? classes.tableHeader : ""}>
                      {cellIndex === 0 ? cellData : cellData}
                    </TableCell>
                  )
                })}
              </TableRow>);
            }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }


  React.useEffect(() => {
    rawDataToMatrix(data);
  }, [data]);

  return tableRender();

};
export default TabularForm;
