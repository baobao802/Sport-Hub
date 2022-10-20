import { Button, message, Table, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/lib/table';
import { Booking, BookingStatus, RequestBookingParams } from 'types';
import _ from 'lodash';
import moment from 'moment';
import { DATE_FORMAT } from 'constant';
import useAsync from '@hooks/useAsync';
import { cancelBooking } from '@services/bookingApi';
import { postNotification } from '@services/notificationFirebase';
import { useGlobalContext } from 'contexts/global';

type Props = {
  data?: Booking[];
  loading?: boolean;
  type?: BookingStatus;
  refresh?: (params: RequestBookingParams) => Promise<void>;
};

const columns: ColumnsType<Booking> = [
  {
    title: 'Tên sân',
    dataIndex: 'pitch',
    align: 'center',
    render(value) {
      return (
        <>
          {value?.name} -{' '}
          <Typography.Text type='secondary'>{value?.hub?.name}</Typography.Text>
        </>
      );
    },
  },
  {
    title: 'Khung giờ',
    dataIndex: 'time',
    align: 'center',
    render(value, record) {
      return (
        <>
          <Tag color='blue'>{value}</Tag>
          <Typography.Text>, {record.date}</Typography.Text>
        </>
      );
    },
  },
  {
    title: 'Giá thuê (VNĐ)',
    dataIndex: 'cost',
    align: 'right',
    render(value) {
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
];

const BookingHistoryTable = (props: Props) => {
  const [dataSource, setDataSource] = useState<Booking[]>(props.data || []);
  const { user } = useGlobalContext();
  const { execute, status } = useAsync(cancelBooking, {
    immediate: false,
  });

  const handleCancelingBooking = (bookingId: string, hubId: string) => {
    execute(bookingId);
    postNotification(hubId, {
      bookingId: bookingId,
      content: `Tài khoản ${user?.email} đã hủy sân.`,
      createdAt: new Date().valueOf(),
      marked: false,
    });
  };

  const successColumns: ColumnsType<Booking> = [
    ...columns,
    {
      title: 'Thời gian thuê',
      dataIndex: 'createdAt',
      render(value) {
        return moment(value).format('dddd, Do MMMM YYYY, HH:mm:ss');
      },
    },
    {
      title: '',
      key: 'action',
      width: 100,
      render: (_, record) => {
        const hm = String(record.time).split(' - ')[0].split(':');
        const onTime =
          moment().add(30, 'minute').valueOf() <
          moment(record.date, DATE_FORMAT)
            .hour(Number(hm[0]))
            .minute(Number(hm[1]))
            .valueOf();
        return (
          <Button
            type='primary'
            danger
            disabled={!onTime}
            loading={status === 'pending'}
            onClick={() =>
              handleCancelingBooking(String(record.hub.id), String(record.id))
            }
          >
            Hủy
          </Button>
        );
      },
    },
  ];

  const cancelColumns: ColumnsType<Booking> = [
    ...columns,
    {
      title: 'Thời gian hủy',
      dataIndex: 'deletedAt',
      render(value) {
        return moment(value).format('dddd, Do MMMM YYYY, HH:mm:ss');
      },
    },
    {
      title: '',
      key: 'action',
      width: 100,
    },
  ];

  useEffect(() => {
    if (props.data) {
      setDataSource(props.data);
    }
  }, [props.data]);

  useEffect(() => {
    if (status === 'success') {
      message.success('Hủy thành công!');
      props.refresh && props.refresh({ status: props.type });
    }
    if (status === 'error') {
      message.error('Không thể hủy!');
    }
  }, [status]);

  if (props?.type === BookingStatus.DONE) {
    return (
      <Table
        rowKey='id'
        columns={successColumns}
        dataSource={dataSource}
        loading={props.loading}
        pagination={false}
      />
    );
  }

  return (
    <Table
      rowKey='id'
      columns={cancelColumns}
      dataSource={dataSource}
      loading={props.loading}
      pagination={false}
    />
  );
};

export default BookingHistoryTable;
