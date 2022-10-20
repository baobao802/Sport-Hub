import { PitchFilter } from '@components/common';
import { mapPitchType } from '@components/common/card/PitchCard';
import { PrimaryLayout } from '@components/layout';
import { getSuccessBooking } from '@services/bookingApi';
import { getAllPitches, RequestParams } from '@services/hubApi';
import { Badge, Card, Col, Row, Typography } from 'antd';
import { DATE_FORMAT } from 'constant';
import { useGlobalContext } from 'contexts/global';
import _ from 'lodash';
import moment from 'moment';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import type { District, Pitch, RequestBookingParams } from 'types';
import styles from '../styles/Explore.module.css';

interface Props {
  pitches: Pitch[];
  districts: District[];
}

export default function ExplorePage(props: Props) {
  const { pitches } = props;
  const { currentCity } = useGlobalContext();
  const [filteredPitches, setFilteredPitches] = useState(pitches);
  const [successBookings, setSuccessBookings] = useState<any>();
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const { search, date, time, type } = router.query;

  const fetchSuccessBooking = async () => {
    try {
      setIsSearching(true);
      const params: RequestBookingParams = {
        date: date as string,
        city: currentCity?.name,
        size: 100,
      };
      const res = await getSuccessBooking(params);
      setSuccessBookings(_.groupBy(res.items, 'pitch.id'));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (moment(date, DATE_FORMAT).isValid()) {
      fetchSuccessBooking();
    }
  }, [date]);

  useEffect(() => {
    const availablePitches = _.filter(pitches, (pitch) => {
      if (type && pitch.type !== type) {
        return false;
      }

      if (
        search &&
        !_.includes(_.lowerCase(pitch.name), _.lowerCase(String(search)))
      ) {
        return false;
      }

      if (time) {
        const foundTime = _.find(pitch.cost, ({ time: t }) => t === time);
        if (!foundTime) {
          return false;
        }
        const hm = String(time).split(' - ')[0].split(':');
        const overtime =
          moment(date, DATE_FORMAT)
            .hour(Number(hm[0]))
            .minute(Number(hm[1]))
            .valueOf() < moment().valueOf();
        const booked = _.find(
          _.get(successBookings, pitch.id) || [],
          (b) => b.time === time,
        );
        return !booked && !overtime;
      }

      const available = _.some(pitch.cost, ({ time: t }) => {
        const hm = String(t).split(' - ')[0].split(':');
        const overtime =
          moment(date, DATE_FORMAT)
            .hour(Number(hm[0]))
            .minute(Number(hm[1]))
            .valueOf() < moment().valueOf();
        const booked = _.find(
          _.get(successBookings, pitch.id) || [],
          (b) => b.time === t,
        );
        return !booked && !overtime;
      });
      return available;
    });
    setFilteredPitches(availablePitches);
  }, [successBookings, search, date, time, type]);

  return (
    <Fragment>
      <Head>
        <title>Khám phá - SportHub</title>
      </Head>

      <section id='tournaments' className='section'>
        <Typography.Title level={3}>Giải đấu</Typography.Title>
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
        <Typography.Title level={3}>Sân bóng</Typography.Title>
        <PitchFilter loading={isSearching} />
        <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
          {filteredPitches.map((pitch) => (
            <Col key={pitch.id} sm={24} md={12} lg={8} xl={6}>
              <Badge.Ribbon {...mapPitchType(pitch.type)}>
                <Link href={`/hubs/${pitch.hub.id}?pitchId=${pitch.id}`}>
                  <Card key={''} size='small' hoverable>
                    <div style={{ fontSize: '16px' }}>Sân {pitch.name}</div>
                    <Typography.Text type='secondary'>
                      {pitch.hub.name}
                    </Typography.Text>
                  </Card>
                </Link>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      </section>
    </Fragment>
  );
}

ExplorePage.Layout = PrimaryLayout;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { city } = context.query as RequestParams;
  const res = await getAllPitches({ city });

  return {
    props: {
      pitches: res.items,
    },
  };
};
