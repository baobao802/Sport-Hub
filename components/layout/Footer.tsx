import { Layout } from 'antd';
import React from 'react';
import styles from './Layout.module.css';

const Footer = () => {
  return (
    <Layout.Footer className={styles.footer}>
      Ant Design ©2018 Created by Ant UED
    </Layout.Footer>
  );
};

export default Footer;
