import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/system';
const useStyles = makeStyles((theme: Theme) => ({
  tableContainer: {
    flex: 1,
  },
  tableHeader: {
    backgroundColor: '#F2F5F7',
    fontWeight: 600
  }
}));
export default useStyles;