import { MatchCard } from '@components/common';
import { PrimaryLayout } from '@components/layout';
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  PageHeader,
  Row,
  Space,
  Statistic,
  Table,
  Tabs,
  Typography,
} from 'antd';
import type { countdownValueType } from 'antd/lib/statistic/utils';
import type { ColumnsType } from 'antd/lib/table';
import type { ClubStandings, MatchDetails, Standings } from 'types';
import { DATE_FORMAT } from 'constant';
import _ from 'lodash';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { Fragment, useState } from 'react';
import styles from '../../styles/TournamentDetails.module.css';

type Props = {
  matches: MatchDetails[];
  standings: Standings;
};

const columns: ColumnsType<ClubStandings> = [
  {
    title: '',
    dataIndex: 'rank',
  },
  {
    title: 'CLB',
    dataIndex: 'name',
    render: (name, record) => (
      <Space>
        <Avatar src={record.avatar} /> {name}
      </Space>
    ),
  },
  {
    title: 'MP',
    dataIndex: 'matchesPlayed',
  },
  {
    title: 'W',
    dataIndex: 'won',
  },
  {
    title: 'D',
    dataIndex: 'draw',
  },
  {
    title: 'L',
    dataIndex: 'loss',
  },
  {
    title: 'GS',
    dataIndex: 'goalsScored',
  },
  {
    title: 'Pts',
    dataIndex: 'points',
  },
];

export default function TournamentPage(props: Props) {
  const { standings } = props;
  const router = useRouter();
  const { tournamentName } = router.query;
  const [registrable, setRegistrable] = useState(false);
  const [deadline, setDeadline] = useState<number>(Date.now() + 1000 * 3);
  const isStarted = true;
  // const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 3;

  const onCountdownChange = (val?: countdownValueType) => {
    if (val && val < 0.05 * 1000) {
      if (!registrable) {
        setDeadline(Date.now() + 1000 * 60 * 60 * 24 * 3);
        setRegistrable(true);
      } else {
        setRegistrable(false);
      }
    }
  };

  return (
    <Fragment>
      <Head>
        <title>{tournamentName} - SportHub</title>
      </Head>

      <section className='section'>
        <PageHeader
          className='section'
          onBack={() => router.back()}
          title={'Tournament Name'}
          style={{ padding: 0 }}
          subTitle='Mùa giải '
          tags={<DatePicker picker='year' defaultValue={moment()} />}
        />

        <Tabs defaultActiveKey='1'>
          {isStarted && (
            <Tabs.TabPane tab='Trận đấu' key='1'>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <DatePicker format={DATE_FORMAT} defaultValue={moment()} />
                </div>
                <Row gutter={[20, 20]}>
                  {_.map(props.matches, (match) => (
                    <Col key={match.id} sm={24} md={12}>
                      <MatchCard data={match} />
                    </Col>
                  ))}
                </Row>
              </div>
            </Tabs.TabPane>
          )}
          {isStarted && (
            <Tabs.TabPane tab='Bảng đấu' key='2'>
              {_.map(standings.groups, (group) => (
                <div
                  key={group.id}
                  style={{
                    maxWidth: 800,
                    margin: '0 auto 20px auto',
                  }}
                >
                  <Typography.Title level={5}>
                    Bảng {group.name}
                  </Typography.Title>
                  <Table
                    rowKey='id'
                    columns={columns}
                    dataSource={group.clubs}
                    pagination={false}
                  />
                </div>
              ))}
            </Tabs.TabPane>
          )}
          <Tabs.TabPane tab='Thông tin' key='3'>
            {isStarted ? (
              <a
                href='https://www.google.com/'
                target='_blank'
                rel='noreferrer'
              >
                Link
              </a>
            ) : (
              <Fragment>
                <Statistic.Countdown
                  title={`HỆ THỐNG SẼ ${
                    registrable ? 'ĐÓNG' : 'MỞ'
                  } ĐĂNG KÝ SAU:`}
                  value={deadline}
                  format='D ngày H giờ m phút s giây'
                  onChange={onCountdownChange}
                />
                {registrable && (
                  <div style={{ marginTop: '20px' }}>
                    <Typography.Paragraph
                      type='warning'
                      style={{ fontSize: '20px' }}
                    >
                      Hãy đọc kỹ thông tin giải đấu và đảm bảo đồng ý quy định
                      của ban tổ chức trước khi bấm nút đăng ký tham gia:{' '}
                      <a
                        href='https://www.google.com/'
                        target='_blank'
                        rel='noreferrer'
                      >
                        Link
                      </a>
                    </Typography.Paragraph>
                    <Button type='primary'>Đăng ký tham gia</Button>
                  </div>
                )}
              </Fragment>
            )}
          </Tabs.TabPane>
        </Tabs>
      </section>
    </Fragment>
  );
}

TournamentPage.Layout = PrimaryLayout;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const MATCHES: MatchDetails[] = [
    {
      id: 1,
      group: 'A',
      pairOfTeams: [
        {
          id: 123,
          name: 'SmartDev',
          avatar: '/images/52758.png',
          goalsScored: 1,
          ranking: 10,
        },
        {
          id: 213,
          name: 'Paradox',
          avatar: '/images/52914.png',
          goalsScored: 1,
          ranking: 12,
        },
      ],
    },
  ];

  const STANDINGS: Standings = {
    session: '2022',
    groups: [
      {
        id: 1,
        name: 'A',
        clubs: [
          {
            id: 1,
            name: 'SmartDev',
            avatar: '/images/52758.png',
            matchesPlayed: 1,
            won: 1,
            draw: 0,
            loss: 0,
            goalsScored: 2,
            points: 3,
            rank: 1,
          },
          {
            id: 2,
            name: 'Paradox',
            avatar: '/images/52914.png',
            matchesPlayed: 1,
            won: 1,
            draw: 0,
            loss: 0,
            goalsScored: 1,
            points: 3,
            rank: 2,
          },
        ],
      },
      {
        id: 2,
        name: 'B',
        clubs: [
          {
            id: 1,
            name: 'SmartDev',
            avatar: '/images/52758.png',
            matchesPlayed: 1,
            won: 1,
            draw: 0,
            loss: 0,
            goalsScored: 2,
            points: 3,
            rank: 1,
          },
          {
            id: 2,
            name: 'Paradox',
            avatar: '/images/52914.png',
            matchesPlayed: 1,
            won: 1,
            draw: 0,
            loss: 0,
            goalsScored: 1,
            points: 3,
            rank: 2,
          },
        ],
      },
    ],
  };
  return {
    props: {
      matches: MATCHES,
      standings: STANDINGS,
    },
  };
};
