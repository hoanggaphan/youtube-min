import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  selectChannelCountry,
  selectChannelDes,
  selectChannelPublishAt,
  selectChannelViewCount,
  selectData,
} from 'app/channelSlice';
import { useAppSelector } from 'app/hook';
import FormattedString from 'components/FormattedString';
import { formatNumberWithDots, formatPublishAt } from 'helpers/format';
import React from 'react';
import { FormattedDisplayName, IntlProvider } from 'react-intl';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginBottom: '24px',
      padding: '0 24px',
    },
    subTitle: {
      margin: '24px 0',
      color: 'black',
    },
    mt12: {
      marginTop: '12px',
    },
    grid: {
      flexDirection: 'column',
      flexWrap: 'nowrap',

      [theme.breakpoints.up('sm')]: {
        columnGap: '96px',
        flexDirection: 'row',
      },
    },
  })
);

export default function About(): JSX.Element {
  const classes = useStyles();
  const description = useAppSelector(selectChannelDes);
  const country = useAppSelector(selectChannelCountry);
  const publishAt = useAppSelector(selectChannelPublishAt);
  const viewCount = useAppSelector(selectChannelViewCount);
  const data = useAppSelector(selectData);

  return (
    <div className={classes.container}>
      {!data ? (
        <>
          <Skeleton animation={false} />
          <Skeleton animation={false} />
          <Skeleton animation={false} width='60%' />
        </>
      ) : (
        <Grid container className={classes.grid}>
          <Grid item xs={12} sm={8}>
            {description && (
              <Box pb='32px' borderBottom='1px solid rgba(125,125,125, .2)'>
                <Typography variant='subtitle1' className={classes.subTitle}>
                  Mô tả
                </Typography>
                <FormattedString str={description} />
              </Box>
            )}

            {country && (
              <Box pb='32px' borderBottom='1px solid rgba(125,125,125, .2)'>
                <Typography variant='subtitle1' className={classes.subTitle}>
                  Chi tiết
                </Typography>
                <div>
                  <Typography
                    variant='caption'
                    color='textSecondary'
                    display='inline'
                  >
                    {'Địa điểm: '}
                  </Typography>
                  <Typography variant='caption' display='inline'>
                    <IntlProvider locale='vi'>
                      <FormattedDisplayName type='region' value={country} />
                    </IntlProvider>
                  </Typography>
                </div>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box py='12px' borderBottom='1px solid rgba(125,125,125, .2)'>
              <Typography variant='subtitle1' className={classes.mt12}>
                Thống kê
              </Typography>
            </Box>
            <Box py='12px' borderBottom='1px solid rgba(125,125,125, .2)'>
              <Typography variant='body2'>
                {publishAt && 'Đã tham gia ' + formatPublishAt(publishAt)}
              </Typography>
            </Box>
            <Box py='12px' borderBottom='1px solid rgba(125,125,125, .2)'>
              <Typography variant='body2'>
                {viewCount && formatNumberWithDots(viewCount) + ' lượt xem'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
