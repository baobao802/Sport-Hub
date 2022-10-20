import { Layout } from 'antd';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { City } from 'types';
import Header from './Header';
import styles from './Layout.module.css';

interface Props {
  children?: ReactNode;
}

const PrimaryLayout = (props: Props) => {
  return (
    <Layout className={styles.root}>
      <Header />
      <Layout.Content className={styles.main}>
        {/* <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className={styles.content}>{props.children}</div>
      </Layout.Content>
      {/* <Footer /> */}
    </Layout>
  );
};

export default PrimaryLayout;
