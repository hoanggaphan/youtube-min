import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const StyledButton = withStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
})(Button);

export default StyledButton;
