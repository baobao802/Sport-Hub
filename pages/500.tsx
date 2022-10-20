import { Button, Result } from 'antd';
import { useRouter } from 'next/router';

const InternalServerError = () => {
  const router = useRouter();

  return (
    <Result
      status='500'
      title='500'
      subTitle='Sorry, something went wrong.'
      extra={
        <Button type='primary' onClick={() => router.back()}>
          Go Back
        </Button>
      }
    />
  );
};

export default InternalServerError;
