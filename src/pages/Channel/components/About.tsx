import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  selectChannelCountry,
  selectChannelDes,
  selectChannelPublishAt,
  selectChannelViewCount
} from 'app/channelSlice';
import { useAppSelector } from 'app/hook';
import { formatChannelViews, formatPublishAt } from 'helpers/format';
import React from 'react';
import { FormattedDisplayName, IntlProvider } from 'react-intl';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    subTitle: {
      margin: '24px 0',
      color: 'black',
    },
    description: {
      whiteSpace: 'pre-wrap',
    },
    mt12: {
      marginTop: '12px',
    },
  })
);

export default function About(): JSX.Element {
  const classes = useStyles();
  const description = useAppSelector(selectChannelDes);
  const country = useAppSelector(selectChannelCountry);
  const publishAt = useAppSelector(selectChannelPublishAt);
  const viewCount = useAppSelector(selectChannelViewCount);

  return (
    <Box mb='24px'>
      <Grid container spacing={10}>
        <Grid item xs={8}>
          {description && (
            <Box pb='32px' borderBottom='1px solid rgba(125,125,125, .2)'>
              <Typography variant='subtitle1' className={classes.subTitle}>
                Mô tả
              </Typography>
              <Typography variant='body2' className={classes.description}>
                {description}
              </Typography>
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
        <Grid item xs={4}>
          <Box py='12px' borderBottom='1px solid rgba(125,125,125, .2)'>
            <Typography variant='subtitle1' className={classes.mt12}>
              Thống kê
            </Typography>
          </Box>
          <Box py='12px' borderBottom='1px solid rgba(125,125,125, .2)'>
            <Typography variant='body2'>
              {'Đã tham gia ' + formatPublishAt(publishAt)}
            </Typography>
          </Box>
          <Box py='12px' borderBottom='1px solid rgba(125,125,125, .2)'>
            <Typography variant='body2'>
              {formatChannelViews(viewCount) + ' lượt xem'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
