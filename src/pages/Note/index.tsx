import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import MyContainer from 'components/MyContainer';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Note(): JSX.Element {
  const history = useHistory();

  return (
    <MyContainer>
      <Box pt='24px'>
        <Box mb='20px'>
          <Typography variant='h5'>Lưu ý</Typography>

          <ul>
            <li>
              Dự án này sử dụng{' '}
              <a
                href='https://developers.google.com/youtube'
                rel='noopener noreferrer'
                target='__blank'
              >
                YouTube Data API
              </a>{' '}
              của googgle và được cấp mức hạn ngạch mặc định là 10.000 đơn vị
              mỗi ngày.
            </li>
            <li>
              {' '}
              Khi ứng dụng sử dụng {'>'} 10.000 thì API sẽ trả về lỗi thay vì dữ
              liệu.
            </li>
          </ul>
        </Box>
        <Box mb='20px'>
          <Typography variant='h5'>Mức sử dụng hạn ngạch</Typography>
          <ul>
            <li>
              Thao tác truy xuất danh sách kênh, video, danh sách phát - 1 đơn
              vị.
            </li>
            <li>Thao tác tạo, cập nhật hoặc xóa tài nguyên - 50 đơn vị.</li>
            <li>Yêu cầu tìm kiếm - 100 đơn vị.</li>
            <li>Tải 1 video lên - 1600 đơn vị.</li>
          </ul>

          <Typography variant='body1'>
            Giả sử hôm nay có 10 người truy cập ứng dụng và sử dụng tính năng
            tải video thì mức đơn vị ứng dụng đã sử dụng là: 10 x 1600 = 16.000.
            Sau khi sử dụng vượt mức hạn ngạch ứng dụng sẽ trả về lỗi, cần đợi
            ngày hôm sau để sử dụng lại.
          </Typography>
          <Typography variant='body1'>
            Do đó dự án này sẻ ko có đủ tính năng như youtube để tránh sử dụng
            vượt mức hạn ngạch khi nhiều user truy cập sử dụng.
          </Typography>
          <Typography variant='body1'>
            Để biết thêm chi tiết vui lòng tham khảo{' '}
            <a
              href='https://developers.google.com/youtube/v3/determine_quota_cost'
              rel='noopener noreferrer'
              target='__blank'
            >
              ở đây
            </a>
          </Typography>
        </Box>
        <Link
          component='button'
          variant='body2'
          onClick={() => {
            history.goBack();
          }}
        >
          Trở về
        </Link>
      </Box>
    </MyContainer>
  );
}
