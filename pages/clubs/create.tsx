import { CreateClubForm } from '@components/common/form';
import { FormValues } from '@components/common/form/CreateClubForm';
import { PrimaryLayout } from '@components/layout';
import { createClub } from '@services/clubApi';
import { Card, message, Typography } from 'antd';
import { useGlobalContext } from 'contexts/global';
import _ from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect } from 'react';
import { City, District } from 'types';

interface Props {
  cities: (City & {
    districts: District[];
  })[];
}

export default function CreateClubPage(props: Props) {
  const { isAuthenticated, user, setUser } = useGlobalContext();
  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    const payload = {
      name: values.name,
      avatar: values.avatar,
      telephone: values.telephone,
      address: {
        street: values.street,
        district: {
          id: values.district.value,
          name: values.district.label,
        },
      },
      members: '[]',
    };
    try {
      const res = await createClub(payload);
      message.success(`CLB ${payload.name} đã được thành lập.`);
      user && setUser({ ...user, clubId: res.id });
      router.push(`/clubs/${res.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    isAuthenticated === false && router.push('/login');
  }, [isAuthenticated]);

  return (
    <Fragment>
      <Head>
        <title>Tạo đội bóng của bạn | SportHub</title>
      </Head>

      <section className='section'>
        <Typography.Title
          level={3}
          style={{ textAlign: 'center', margin: '20px 0' }}
        >
          Tạo CLB của bạn
        </Typography.Title>
        <Card hoverable style={{ width: 420, margin: 'auto', cursor: 'unset' }}>
          <CreateClubForm onSubmit={onSubmit} />
        </Card>
      </section>
    </Fragment>
  );
}

CreateClubPage.Layout = PrimaryLayout;
