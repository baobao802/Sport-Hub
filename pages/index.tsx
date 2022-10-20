import { Fragment } from 'react';
import type { GetStaticProps } from 'next';
import { PrimaryLayout } from '@components/layout';
import { Carousel, Col, Row, Typography } from 'antd';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useGlobalContext } from 'contexts/global';

interface Props {}

export default function HomePage(props: Props) {
  const { currentCity } = useGlobalContext();

  return (
    <Fragment>
      <Head>
        <title>Trang chủ - SportHub</title>
      </Head>
      <section className={styles.hero_section}>
        <Carousel autoplay>
          <div className={styles.hero_content}>
            <h3>1</h3>
          </div>
          <div className={styles.hero_content}>
            <h3>2</h3>
          </div>
          <div className={styles.hero_content}>
            <h3>3</h3>
          </div>
          <div className={styles.hero_content}>
            <h3>4</h3>
          </div>
        </Carousel>
      </section>

      <section className={styles.explore_section}>
        <div style={{ textAlign: 'center', margin: 32 }}>
          <Typography.Title>Khám phá</Typography.Title>
          <Typography.Paragraph>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
            consectetur laboriosam quis maxime exercitationem natus amet, modi
            vel!
          </Typography.Paragraph>
        </div>
        <Row style={{ height: 360 }}>
          <Col span={12}>
            <div style={{ height: 360, width: 400 }}>
              <Link href={`/explore?city=${currentCity?.name}`}>
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
                  <Link href={`/explore?city=${currentCity?.name}`}>
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
                  <Link href='/partner-registration'>
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. In quidem
            necessitatibus culpa eligendi pariatur minus? Explicabo totam
            delectus nulla voluptates quam repudiandae cumque ea assumenda
            magnam quos odit, optio suscipit!
          </Typography.Paragraph>
        </div>
      </section>
    </Fragment>
  );
}

HomePage.Layout = PrimaryLayout;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      data: [1, 2, 3],
    },
    revalidate: 12 * 60 * 60,
    // notFound: true,
    // redirect: {
    //   destination: '/403'
    // }
  };
};
