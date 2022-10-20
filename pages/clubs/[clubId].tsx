import { EditOutlined, SmileOutlined } from '@ant-design/icons';
import { ClubDetailsForm } from '@components/common/form';
import { FormValues } from '@components/common/form/ClubDetailsForm';
import { ClubMemberTable } from '@components/common/table';
import { PrimaryLayout } from '@components/layout';
import useAsync from '@hooks/useAsync';
import { getClubById, updateClubById } from '@services/clubApi';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  message,
  Modal,
  Tabs,
  Typography,
} from 'antd';
import _ from 'lodash';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import type { ClubDetails } from 'types';
import styles from '../../styles/ClubDetails.module.css';

interface Props {
  clubDetails: ClubDetails;
  fallback: {
    [key: string]: ClubDetails;
  };
}

export default function ClubDetailsPage(props: Props) {
  const router = useRouter();
  const { clubId } = router.query;
  const [openModal, setOpenModal] = useState(false);
  const { data: clubDetails, execute: refreshClubDetails } =
    useAsync<ClubDetails | null>(getClubById, {
      initialData: props.clubDetails,
      immediate: false,
    });
  const { execute: updateClub, status: updateClubStatus } = useAsync(
    updateClubById,
    {
      immediate: false,
    },
  );

  const handleSubmit = (values: FormValues) => {
    updateClub(clubDetails?.id, {
      ...values,
    });
    setOpenModal(false);
  };

  useEffect(() => {
    if (updateClubStatus === 'success') {
      refreshClubDetails(clubId);
      message.success('Cập nhật thông tin thành công.');
    }
    if (updateClubStatus === 'error') {
      message.error('Cập nhật thông tin không thành công.');
    }
  }, [updateClubStatus]);

  if (!clubDetails) {
    return <div>loading...</div>;
  }
  console.log(clubDetails);
  return (
    <Fragment>
      <Head>
        <title>{clubDetails.name} | SportHub</title>
      </Head>

      <section className='section' style={{ display: 'flex' }}>
        <Card className={styles.club}>
          <Button
            className={styles.edit_btn}
            icon={<EditOutlined />}
            title='Cập nhật thông tin CLB'
            onClick={() => setOpenModal(true)}
          />
          <Modal
            title='Cập nhật thông tin CLB'
            visible={openModal}
            onCancel={() => setOpenModal(false)}
            footer={null}
          >
            <ClubDetailsForm
              initialValues={{
                name: clubDetails.name,
                bio: clubDetails.bio,
              }}
              onSubmit={handleSubmit}
              onCancel={() => setOpenModal(false)}
            />
          </Modal>
          <div className={styles.club_header}>
            <Avatar
              src={clubDetails.avatar}
              size={128}
              icon={<SmileOutlined />}
              style={{ marginBottom: '10px' }}
            />
            <Typography.Title level={5}>{clubDetails.name}</Typography.Title>
          </div>
          <div>
            <Descriptions column={1}>
              <Descriptions.Item label='Tiểu sử'>
                {clubDetails.bio}
              </Descriptions.Item>
              <Descriptions.Item label='Xếp hạng'>
                No.{clubDetails.ranking}
              </Descriptions.Item>
              <Descriptions.Item label='Quản lý'>
                {clubDetails.manager.firstName} {clubDetails.manager.lastName}
              </Descriptions.Item>
              <Descriptions.Item label='SĐT'>
                {clubDetails.manager.telephone}
              </Descriptions.Item>
              <Descriptions.Item label='Email'>
                {clubDetails.manager.email}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Card>
        <Card className={styles.widgets} bordered={false}>
          <Tabs defaultActiveKey='1'>
            <Tabs.TabPane tab='Thành viên' key='1'>
              <ClubMemberTable
                clubDetails={clubDetails}
                data={clubDetails.members}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Giải đấu' key='2'>
              Timeline các giải đấu đã tham gia
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </section>
    </Fragment>
  );
}

ClubDetailsPage.Layout = PrimaryLayout;

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clubs`);
  const clubs = await res.json();
  const paths = _.map(clubs, ({ id }) => ({ params: { clubId: String(id) } }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const clubDetails = await getClubById(+params!.clubId!);

  if (!clubDetails) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      clubDetails,
    },
    revalidate: 10,
  };
};
