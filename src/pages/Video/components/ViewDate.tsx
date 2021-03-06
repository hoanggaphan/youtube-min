import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { formatNumberWithDots, formatPublishAt } from 'helpers/format';
import React from 'react';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    views: {
      '&::after': {
        content: '"•"',
        margin: '0 4px',
      },
    },
  });
});

export default function ViewDate({
  videoData,
}: {
  videoData: gapi.client.youtube.Video;
}): JSX.Element {
  const classes = useStyles();
  const publishAt = videoData?.snippet?.publishedAt;
  const live = videoData?.snippet?.liveBroadcastContent;
  const viewCount = videoData?.statistics?.viewCount;
  const liveStreaming = videoData?.liveStreamingDetails;

  if (live === 'live') {
    return (
      <div>
        <Typography
          className={classes.views}
          component='span'
          variant='body2'
          color='textSecondary'
        >
          {liveStreaming?.concurrentViewers &&
            formatNumberWithDots(liveStreaming?.concurrentViewers) +
              ' người đang xem'}
        </Typography>

        <Typography component='span' variant='body2' color='textSecondary'>
          {liveStreaming?.actualStartTime &&
            'Bắt đầu phát trực tiếp vào ' +
              formatPublishAt(liveStreaming.actualStartTime)}
        </Typography>
      </div>
    );
  }

  // if (live === 'upcoming') {

  // }

  return (
    <div>
      <Typography
        className={classes.views}
        component='span'
        variant='body2'
        color='textSecondary'
      >
        {viewCount && formatNumberWithDots(viewCount) + ' lượt xem'}
      </Typography>

      <Typography component='span' variant='body2' color='textSecondary'>
        {liveStreaming?.actualStartTime
          ? 'Đã phát trực tiếp vào ' +
            formatPublishAt(liveStreaming.actualStartTime)
          : publishAt && formatPublishAt(publishAt)}
      </Typography>
    </div>
  );
}
