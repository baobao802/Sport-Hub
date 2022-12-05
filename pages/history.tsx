import { BookingHistoryTable } from '@components/common/table';
import { PrimaryLayout } from '@components/layout';
import { getMyBookingHistory } from '@services/bookingApi';
import { useQuery } from '@tanstack/react-query';
import { PageHeader, Tabs } from 'antd';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { Booking, BookingStatus } from 'types';

export default function History() {
  const router = useRouter();
  const { status } = useSession();
  const [activeKey, setActiveKey] = useState(BookingStatus.DONE);
  const bookingHistories = useQuery<Booking[]>({
    queryKey: ['bookingsHistory', activeKey],
    queryFn: ({ queryKey }) =>
      getMyBookingHistory({ status: queryKey[1] as BookingStatus }),
  });
  if (status === 'unauthenticated') {
    router.push('/login');
  }

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
              data={bookingHistories.data}
              loading={bookingHistories.isLoading}
              refresh={bookingHistories.refetch}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab='Đã hủy' key={BookingStatus.CANCEL}>
            <BookingHistoryTable
              type={BookingStatus.CANCEL}
              data={bookingHistories?.data}
              loading={bookingHistories.isLoading}
              refresh={bookingHistories.refetch}
            />
          </Tabs.TabPane>
        </Tabs>
      </section>
    </Fragment>
  );
}

History.Layout = PrimaryLayout;
