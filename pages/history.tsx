import { BookingHistoryTable } from '@components/common/table';
import { PrimaryLayout } from '@components/layout';
import useAsync from '@hooks/useAsync';
import { getMyBookingHistory } from '@services/bookingApi';
import { PageHeader, Tabs } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { Booking, BookingStatus } from 'types';

interface Props {}

export default function History(props: Props) {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState(BookingStatus.DONE);
  const {
    data: bookingHistories,
    execute: refreshBookingHistory,
    status,
  } = useAsync<{
    items: Booking[];
  } | null>(getMyBookingHistory, { args: [{ status: activeKey }] });

  useEffect(() => {
    refreshBookingHistory({ status: activeKey });
  }, [activeKey]);

  return (
    <Fragment>
      <Head>
        <title>Lịch sử đặt sân - SportHub</title>
      </Head>
      <section className='section'>
        <PageHeader
          className='section'
          onBack={() => router.back()}
          title={'Lịch sử'}
          style={{ padding: 0 }}
        />
        <Tabs
          defaultActiveKey={activeKey}
          onChange={(key) => setActiveKey(key as BookingStatus)}
        >
          <Tabs.TabPane tab='Đã xác nhận' key={BookingStatus.DONE}>
            <BookingHistoryTable
              type={BookingStatus.DONE}
              data={bookingHistories?.items}
              loading={status === 'pending'}
              refresh={refreshBookingHistory}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Đã hủy' key={BookingStatus.CANCEL}>
            <BookingHistoryTable
              type={BookingStatus.CANCEL}
              data={bookingHistories?.items}
              loading={status === 'pending'}
              refresh={refreshBookingHistory}
            />
          </Tabs.TabPane>
        </Tabs>
      </section>
    </Fragment>
  );
}

History.Layout = PrimaryLayout;
