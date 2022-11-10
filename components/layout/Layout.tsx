import { Layout } from 'antd';
import React, { ReactNode } from 'react';
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
        <div className={styles.content}>{props.children}</div>
      </Layout.Content>
      {/* <Footer /> */}
    </Layout>
  );
};

export default PrimaryLayout;
