import { FileSearchOutlined, HeartOutlined } from '@ant-design/icons';
import { Card, Rate } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment } from 'react';
import type { Hub } from 'types';
import styles from './HubCard.module.css';

interface Props {
  data: Hub;
  onLove?: () => void;
}

const HubCard = (props: Props) => {
  const { data, onLove } = props;

  return (
    <Card
      className={styles.root}
      style={{ width: 320 }}
      cover={
        <Image
          src={data.picture}
          alt={data.name}
          layout='responsive'
          width={320}
          height={180}
          objectFit='cover'
        />
      }
      actions={[
        <HeartOutlined key='interesting' onClick={onLove} />,
        <Link key='details' href={`/hubs/${data.id}`}>
          <a>
            <FileSearchOutlined />
          </a>
        </Link>,
      ]}
    >
      <Card.Meta
        title={data.name}
        description={
          <Fragment>
            <Rate
              className={styles.meta_rate}
              disabled
              allowHalf
              defaultValue={data.rating}
            />
            <p className={styles.meta_address}>
              {`${data.address.street}, ${data.address.district.name}`}
            </p>
          </Fragment>
        }
      />
    </Card>
  );
};

export default HubCard;
