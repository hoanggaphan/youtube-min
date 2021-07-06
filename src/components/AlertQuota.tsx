import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';

export default function AlertQuota(): JSX.Element {
  return (
    <Alert severity='warning'>
      <AlertTitle>Lưu ý</AlertTitle>
      Đây chỉ là trang Demo sử dụng kết quả tìm kiếm của từ khóa "one piece"{' '}
      <strong>check it out!</strong>
    </Alert>
  );
}
