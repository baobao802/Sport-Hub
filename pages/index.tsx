import { Fragment } from 'react';
import { PrimaryLayout } from '@components/layout';
import { Carousel, Col, Row, Typography } from 'antd';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useGlobalContext } from 'contexts/global';

export default function HomePage() {
  const { currentCity } = useGlobalContext();

  return (
    <Fragment>
      <Head>
        <title>Trang chủ - SportHub</title>
      </Head>
      <section className={styles.hero_section}>
        <Carousel autoplay autoplaySpeed={3000}>
          <div className={styles.hero_content}>
            <img src='/images/hero_1.png' />
          </div>
          <div className={styles.hero_content}>
            <img src='/images/hero_2.jpeg' />
          </div>
          <div className={styles.hero_content}>
            <img src='/images/hero_3.png' />
          </div>
          <div className={styles.hero_content}>
            <img src='/images/hero_4.png' />
          </div>
        </Carousel>
      </section>

      <section className={styles.explore_section}>
        <div style={{ textAlign: 'center', margin: 32 }}>
          <Typography.Title>Khám phá</Typography.Title>
          <Typography.Paragraph>
            Hãy bắt đầu khám phá và trải nghiệm các tính năng của Sport Hub.
          </Typography.Paragraph>
        </div>
        <Row style={{ height: 360 }}>
          <Col span={12}>
            <div style={{ height: 360, width: 400 }}>
              <Link href={`/explore?cityId=${currentCity?.id}`}>
                <a className={styles.explore_item}>
                  <Image
                    layout='fill'
                    src='/images/tournaments.jpg'
                    alt='Giải đấu'
                  />
                  <div className={styles.explore_item__mask}>
                    <Typography.Title level={3}>Giải đấu</Typography.Title>
                  </div>
                </a>
              </Link>
            </div>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={24}>
                <div style={{ height: 180, width: 400 }}>
                  <Link href={`/explore?cityId=${currentCity?.id}`}>
                    <a className={styles.explore_item}>
                      <Image
                        layout='fill'
                        src='/images/field.jpg'
                        alt='Sân bóng'
                        objectFit='cover'
                      />
                      <div className={styles.explore_item__mask}>
                        <Typography.Title level={3}>Sân bóng</Typography.Title>
                      </div>
                    </a>
                  </Link>
                </div>
              </Col>

              <Col span={24}>
                <div style={{ height: 180, width: 400 }}>
                  <Link href='https://sport-hub-admin.vercel.app/sign-up'>
                    <a className={styles.explore_item}>
                      <Image
                        layout='fill'
                        src='/images/partner.jpg'
                        alt='Đối tác'
                        objectFit='cover'
                      />
                      <div className={styles.explore_item__mask}>
                        <Typography.Title level={3}>Đối tác</Typography.Title>
                      </div>
                    </a>
                  </Link>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>

      <section className={styles.about_section}>
        <div className={styles.about_header}>
          <Typography.Title>Về chúng tôi</Typography.Title>
          <Typography.Paragraph>
            Với mong muốn kết nối các địa điểm cho thuê sân bóng đá tới với mọi
            người. Chúng tôi tạo ra trang web này giúp bạn có thể tìm kiếm và
            đặt lịch sân bóng đá dễ dàng. Cung cấp hệ thống cho thuê sân bóng
            dành cho chủ sân bóng.
          </Typography.Paragraph>
        </div>
      </section>
    </Fragment>
  );
}

HomePage.Layout = PrimaryLayout;
