import { Button, Result } from 'antd';
import { useRouter } from 'next/router';

const Forbidden = () => {
  const router = useRouter();

  return (
    <Result
      status='403'
      title='403'
      subTitle='Sorry, you are not authorized to access this page.'
      extra={
        <Button type='primary' onClick={() => router.back()}>
          Go Back
        </Button>
      }
    />
  );
};

export default Forbidden;
