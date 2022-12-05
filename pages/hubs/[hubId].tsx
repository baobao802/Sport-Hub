import { PitchCard } from '@components/common';
import { PrimaryLayout } from '@components/layout';
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Form,
  FormInstance,
  Input,
  List,
  message,
  Modal,
  PageHeader,
  Rate,
  Row,
  Tabs,
} from 'antd';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import type { BookingPayload, HubDetails, Pitch, Rating } from 'types';
import { CheckboxOptionType } from 'antd/lib/checkbox/Group';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { getHubById, getAllHubs } from '@services/hubApi';
import { useGlobalContext } from 'contexts/global';
import { createBooking } from '@services/bookingApi';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getHubRatings, postUserRating } from '@services/ratingFirebase';
import moment from 'moment';
import { postNotification } from '@services/notificationFirebase';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

interface Props {
  hubDetails: HubDetails;
}

const costMapper = (cost: any): CheckboxOptionType[] =>
  _.map(
    cost,
    ({ time, value }): CheckboxOptionType => ({
      label: (
        <div>
          <div>{time}</div>
          <div>
            {`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} (VND/giờ)
          </div>
        </div>
      ),
      value: time,
    }),
  );
export default function HubDetailsPage(props: Props) {
  const { hubDetails } = props;
  const { cities, currentCity } = useGlobalContext();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { hubId } = router.query;
  const [bookingPayload, setBookingPayload] = useState<BookingPayload>();
  const [isBooking, setIsBooking] = useState(false);
  const formRatingRef = useRef<FormInstance<any>>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState<Rating>();
  const [updatedPitchId, setUpdatedPitchId] = useState<string>();
  const hubRate = useMemo(
    () =>
      _.reduce(ratings, (sum, { rate }) => sum + rate, 0) /
      (_.size(ratings) || 1),
    [ratings],
  );
  const counterRef = useRef<NodeJS.Timer>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const socketRef = useRef<Socket>();
  hubDetails.address.city = useMemo(
    () =>
      _.find(
        cities,
        ({ districts }) =>
          !!_.find(
            districts,
            ({ id }) => id === hubDetails.address.district.id,
          ),
      ),
    [hubDetails, cities],
  )!;

  const handleSelectPitchCard = (pitch: Pitch, value?: any) => {
    value
      ? setBookingPayload({ pitchId: pitch.id, ...value })
      : setBookingPayload(undefined);
  };

  const handleBooking = async (payload: BookingPayload) => {
    clearTimeout(timeoutRef.current);
    clearInterval(counterRef.current);
    setIsBooking(true);
    // await createBooking({
    //   ...payload,
    //   cityId: currentCity?.id,
    // });
    socketRef.current?.emit(
      'create-new-booking',
      {
        ...payload,
        cityId: currentCity?.id,
      },
      (session as any).accessToken,
    );
  };

  const onSubmit = () => {
    if (status === 'unauthenticated') {
      router.push({
        pathname: '/login',
        query: {
          redirect: router.asPath,
        },
      });
    } else {
      let secondsToGo = 5;
      const modal = Modal.confirm({
        title: 'Xác nhận yêu cầu đặt sân.',
        content: `Yêu cầu của bạn sẽ tự động gửi đi sau ${secondsToGo} giây.`,
        onOk: () => handleBooking(bookingPayload!),
        onCancel: () => {
          clearTimeout(timeoutRef.current);
          clearInterval(counterRef.current);
        },
      });
      timeoutRef.current = setTimeout(() => {
        clearInterval(counterRef.current);
        modal.destroy();
        handleBooking(bookingPayload!);
      }, secondsToGo * 1000);
      counterRef.current = setInterval(() => {
        secondsToGo -= 1;
        modal.update({
          content: `Yêu cầu của bạn sẽ tự động gửi đi sau ${secondsToGo} giây.`,
        });
      }, 1000);
    }
  };

  const onSubmitRating = (values: any) => {
    if (status === 'unauthenticated') {
      router.push({
        pathname: '/login',
        query: {
          redirect: router.asPath,
        },
      });
    } else {
      postUserRating(
        Number(hubId),
        {
          ...values,
          email: session?.user?.email,
          avatar: session?.user?.image,
          updateAt: new Date().valueOf(),
        },
        () => {
          formRatingRef.current?.resetFields();
          message.success('Cảm ơn đánh giá của bạn <3!!!');
        },
      );
    }
  };

  useEffect(() => {
    if (hubId) {
      getHubRatings(Number(hubId), (values) => setRatings(values));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hubId]);

  useEffect(() => {
    if (ratings.length > 0 && status === 'authenticated') {
      const found = _.find(
        ratings,
        ({ email }) => email === session.user?.email,
      );
      found && setUserRating(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratings, status]);

  useEffect(() => {
    const uri = 'wss://sport-hub-apis.eastasia.cloudapp.azure.com/booking';
    const socket = io(uri, {
      transports: ['websocket'],
      withCredentials: true,
      rejectUnauthorized: false,
    });
    socketRef.current = socket;

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on('create-new-booking', (createdBooking) => {
      setUpdatedPitchId(createdBooking.pitch.id);
      setIsBooking(false);
      message.success(
        'Đặt sân thành công! Vui lòng kiểm tra hộp thư email của bạn.',
      );

      postNotification(String(hubId), {
        bookingId: createdBooking.id,
        content: `Tài khoản ${session?.user?.email} đã đặt sân.`,
        createdAt: new Date().valueOf(),
        marked: false,
      });
      router.push('/history');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const fullAddress = `${hubDetails.address.street}, ${hubDetails.address.district.name}, ${hubDetails.address?.city?.name}`;
  return (
    <Fragment>
      <Head>
        <title>{hubDetails.name} - SportHub</title>
      </Head>

      <section className='section' style={{ paddingBottom: 0 }}>
        <PageHeader
          className='section'
          onBack={() => router.push(`/explore?cityId=${currentCity?.id}`)}
          title={hubDetails.name}
          subTitle={
            <Rate
              disabled
              allowHalf
              value={hubRate}
              style={{ lineHeight: 0 }}
            />
          }
          style={{ padding: 0 }}
        >
          <Descriptions column={2}>
            <Descriptions.Item label='Email'>
              <a href={`mailto:${hubDetails.owner.email}`}>
                {hubDetails.owner.email}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label='Telephone'>
              <a href={`tel:+${hubDetails.owner.telephone}`}>
                {hubDetails.owner.telephone}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label='Address'>
              <a
                href={`https://www.google.com/maps/place/${fullAddress.replace(
                  '/',
                  '%2F',
                )}`}
                target='_blank'
                rel='noreferrer'
              >
                {fullAddress}
              </a>
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </section>

      <section className='section'>
        <Tabs
          defaultActiveKey='1'
          tabBarExtraContent={
            <Button
              type='primary'
              disabled={!bookingPayload}
              loading={isBooking}
              onClick={onSubmit}
            >
              Đặt sân
            </Button>
          }
        >
          <Tabs.TabPane tab='Sân bóng' key='1'>
            <Row gutter={[30, 30]}>
              {hubDetails.pitches.map((pitch) => (
                <Col key={pitch.id} sm={12} md={6}>
                  <PitchCard
                    data={pitch}
                    options={costMapper(pitch.cost)}
                    selected={bookingPayload?.pitchId}
                    onSelect={(value) => handleSelectPitchCard(pitch, value)}
                  />
                </Col>
              ))}
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab='Đánh giá' key='2'>
            <Row gutter={[50, 20]}>
              <Col sm={24} md={16}>
                <div
                  id='scrollableDiv'
                  style={{
                    height: 400,
                    overflow: 'auto',
                    padding: '0 16px',
                  }}
                >
                  <InfiniteScroll
                    dataLength={_.size(ratings)}
                    scrollableTarget='scrollableDiv'
                    next={function () {
                      throw new Error('Function not implemented.');
                    }}
                    hasMore={false}
                    loader={undefined}
                  >
                    <List
                      itemLayout='vertical'
                      size='large'
                      dataSource={ratings}
                      renderItem={(item) => (
                        <List.Item key={item.email}>
                          <List.Item.Meta
                            avatar={
                              <Avatar src={item.avatar} alt={item.email} />
                            }
                            title={item.email}
                            description={moment(item.updateAt).format(
                              'HH:mm:ss, DD/MM/YYYY',
                            )}
                          />
                          <div>
                            <Rate
                              disabled
                              value={item.rate}
                              style={{ fontSize: 15 }}
                            />
                          </div>
                          <div>{item.comment}</div>
                        </List.Item>
                      )}
                    />
                  </InfiniteScroll>
                </div>
              </Col>
              <Col sm={24} md={8}>
                {!userRating && (
                  <Form ref={formRatingRef} onFinish={onSubmitRating}>
                    <Form.Item
                      name='rate'
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng để lại đánh giá của bạn.',
                        },
                      ]}
                    >
                      <Rate style={{ lineHeight: 0, fontSize: 50 }} />
                    </Form.Item>
                    <Form.Item name='comment'>
                      <Input.TextArea
                        rows={6}
                        placeholder='Nhập nội dung đánh giá của bạn'
                        size='large'
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type='primary' htmlType='submit'>
                        Gửi
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </section>
    </Fragment>
  );
}

HubDetailsPage.Layout = PrimaryLayout;

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const hubs = await getAllHubs();
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hubs`);
  // const hubs = await res.json();

  const paths = _.map(hubs.items, ({ id }) => ({
    params: { hubId: String(id) },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const hubDetails = await getHubById(params?.hubId as string);

  if (!hubDetails) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      hubDetails,
    },
    revalidate: 10,
  };
};
