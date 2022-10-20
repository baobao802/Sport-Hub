import { GoogleOutlined } from '@ant-design/icons';
import { PrimaryLayout } from '@components/layout';
import { Button, Card } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment } from 'react';
import styles from '../styles/Login.module.css';

export default function LoginPage() {
  return (
    <Fragment>
      <Head>
        <title>Đăng nhập - SportHub</title>
      </Head>
      <div className={styles.root}>
        <Card
          style={{
            maxWidth: '320px',
            margin: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
          bordered={false}
        >
          <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
            <Button type='primary' size='large' icon={<GoogleOutlined />} block>
              Google
            </Button>
          </Link>
        </Card>
      </div>
    </Fragment>
  );
}

LoginPage.Layout = PrimaryLayout;
