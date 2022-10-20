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
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './Layout.module.css';

type Props = {};

const Header = (props: Props) => {
  const { user, isAuthenticated, logout, cities, currentCity, setCurrentCity } =
    useGlobalContext();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleChangeCity = (value: number) => {
    const found = cities.find((city) => city.id === value);
    found && setCurrentCity({ id: found.id, name: found.name });
  };

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <Link
              href={user?.club ? `/clubs/${user?.club.id}` : `/clubs/create`}
            >
              <a>CLB</a>
            </Link>
          ),
          icon: <UserOutlined />,
        },
        {
          key: '2',
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
            href={`/explore?city=${currentCity?.name}`}
            activeClassName={styles.active}
          >
            <a className={styles.navLink}>Khám phá</a>
          </NavLink>
        </Space>
      </Space>

      {!isAuthenticated && (
        <Space>
          <Link href='/login'>
            <a>
              <Button type='primary' shape='round'>
                Đăng Nhập
              </Button>
            </a>
          </Link>
        </Space>
      )}

      {isAuthenticated && (
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
              alt={user?.email}
              src={user?.club?.avatar}
            />
          </Dropdown>
        </Space>
      )}
    </Layout.Header>
  );
};

export default Header;
