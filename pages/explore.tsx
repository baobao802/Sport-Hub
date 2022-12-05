import { FrownOutlined } from '@ant-design/icons';
import { PitchFilter } from '@components/common';
import { mapPitchType } from '@components/common/card/PitchCard';
import { PrimaryLayout } from '@components/layout';
import { getAllAvailablePitches, PitchRequestParams } from '@services/hubApi';
import { useQuery } from '@tanstack/react-query';
import { Badge, Card, Col, Result, Row, Space, Spin, Typography } from 'antd';
import { DATE_FORMAT } from 'constant';
import _ from 'lodash';
import moment from 'moment';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { District, Pitch } from 'types';
import styles from '../styles/Explore.module.css';

interface Props {
  pitches: Pitch[];
  districts: District[];
}

export default function ExplorePage(props: Props) {
  const router = useRouter();
  const { search, date, time, type, cityId } = router.query;
  const availablePitches = useQuery({
    queryKey: ['availablePitches', { cityId, date, time, type, search }],
    queryFn: ({ queryKey }) =>
      getAllAvailablePitches(queryKey[1] as PitchRequestParams),
    initialData: props.pitches,
  });

  return (
    <Fragment>
      <Head>
        <title>Khám phá - SportHub</title>
      </Head>

      <section id='tournaments' className='section'>
        <Typography.Title level={3}>Giải đấu (coming soon)</Typography.Title>
        <Card>
          <Card.Grid className={styles.card_item}>
            <Link href='/tournaments/dsc-championship'>
              <a>DSC Championship</a>
            </Link>
          </Card.Grid>
          <Card.Grid className={styles.card_item}>
            <Link href='/tournaments/smd-championship'>
              <a>SMD Championship</a>
            </Link>
          </Card.Grid>
        </Card>
      </section>

      <section id='hubs' className={`section ${styles.root}`}>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          Sân bóng
        </Typography.Title>
        <PitchFilter />
        {availablePitches.isError ? (
          <Result status='error' title='Đã có lỗi xảy ra!' />
        ) : availablePitches.isLoading ? (
          <Space
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '20px',
              height: '360px',
            }}
          >
            <Spin size='large' />
          </Space>
        ) : _.size(availablePitches.data) === 0 ? (
          <Result icon={<FrownOutlined />} title='Không tìm thấy!' />
        ) : (
          <div>
            <Typography.Paragraph
              type='secondary'
              style={{ textAlign: 'right', fontSize: 14 }}
            >
              {_.size(availablePitches.data)} sân bóng được tìm thấy
            </Typography.Paragraph>

            <div
              id='scrollableDiv'
              style={{
                height: 480,
                width: '100%',
                overflow: 'auto',
              }}
            >
              <InfiniteScroll
                dataLength={_.size(availablePitches.data)}
                scrollableTarget='scrollableDiv'
                next={function () {
                  throw new Error('Function not implemented.');
                }}
                hasMore={false}
                loader={undefined}
                style={{ height: 480, padding: '0 10px' }}
              >
                <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
                  {availablePitches.data.map((pitch) => (
                    <Col key={pitch.id} sm={24} md={12} lg={8} xl={6}>
                      <Badge.Ribbon {...mapPitchType(pitch.type)}>
                        <Link
                          href={`/hubs/${pitch.hub.id}?pitchId=${pitch.id}`}
                        >
                          <Card key={''} size='small' hoverable>
                            <div style={{ fontSize: '16px' }}>{pitch.name}</div>
                            <Typography.Text type='secondary'>
                              {pitch.hub.name}
                            </Typography.Text>
                          </Card>
                        </Link>
                      </Badge.Ribbon>
                    </Col>
                  ))}
                </Row>
              </InfiniteScroll>
            </div>
          </div>
        )}
      </section>
    </Fragment>
  );
}

ExplorePage.Layout = PrimaryLayout;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { cityId } = context.query as PitchRequestParams;
  const availablePitches = await getAllAvailablePitches({
    cityId,
    date: moment().format(DATE_FORMAT),
  });

  return {
    props: {
      pitches: availablePitches,
    },
  };
};
