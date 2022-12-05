import {
  CalendarOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { NavLink } from '@components/common';
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  Select,
  Space,
  Tooltip,
} from 'antd';
import { useGlobalContext } from 'contexts/global';
import _ from 'lodash';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './Layout.module.css';

const Header = () => {
  const { cities, currentCity, changeCurrentCity } = useGlobalContext();
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
  };

  const handleChangeCity = (value: string) => {
    const foundCity = cities.find((city) => city.id === value);
    if (foundCity) {
      changeCurrentCity(foundCity);
      router.query.cityId = foundCity?.id;
      router.push(router);
    }
  };

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <a onClick={handleLogout}>Đăng xuất</a>,
          icon: <LogoutOutlined />,
        },
      ]}
    />
  );

  return (
    <Layout.Header className={styles.header}>
      <Link href='/'>
        <a className={styles.logo}>
          <Image src='/images/logo.svg' layout='fill' alt='Sport Hub Logo' />
        </a>
      </Link>

      <Space className={styles.searchBar} size='large'>
        <Select
          placeholder='Thành phố'
          style={{ width: 150, marginRight: 50 }}
          value={currentCity?.id}
          onChange={handleChangeCity}
        >
          {_.map(cities, ({ id, name }) => (
            <Select.Option key={id} value={id}>
              {name}
            </Select.Option>
          ))}
        </Select>

        <Space size='large'>
          <NavLink href='/' activeClassName={styles.active}>
            <a className={styles.navLink}>Trang chủ</a>
          </NavLink>
          <NavLink
            href={`/explore?cityId=${currentCity?.id}`}
            activeClassName={styles.active}
          >
            <a className={styles.navLink}>Khám phá</a>
          </NavLink>
        </Space>
      </Space>

      {status === 'unauthenticated' && (
        <Space>
          <Button
            type='primary'
            shape='round'
            onClick={() =>
              router.push({
                pathname: '/login',
                query: {
                  redirect: router.asPath,
                },
              })
            }
          >
            Đăng Nhập
          </Button>
        </Space>
      )}

      {status === 'authenticated' && (
        <Space size='large'>
          <Tooltip title='Lịch sử đặt sân' placement='bottomRight'>
            <Button
              type='text'
              shape='circle'
              icon={<CalendarOutlined />}
              onClick={() => router.push('/history')}
            />
          </Tooltip>
          <Dropdown overlay={menu} placement='bottomRight' arrow>
            <Avatar
              size='large'
              icon={<UserOutlined />}
              alt={session?.user?.name || ''}
              src={session?.user?.image}
            />
          </Dropdown>
        </Space>
      )}
    </Layout.Header>
  );
};

export default Header;
