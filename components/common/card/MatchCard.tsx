import { Card, Modal, Space, Typography } from 'antd';
import moment from 'moment';
import Image from 'next/image';
import React, { Fragment, useState } from 'react';
import type { MatchDetails } from 'types';
import styles from './MatchCard.module.css';

type Props = {
  data: MatchDetails;
};

const MatchCard = (props: Props) => {
  const { data } = props;
  const [visible, setVisible] = useState(false);

  const onClickViewMore = () => {
    setVisible(true);
  };

  return (
    <Fragment>
      <Card className={styles.match_card}>
        <div>
          <Typography.Text type='secondary'>Bảng {data.group}</Typography.Text>
        </div>
        <div className={styles.match_card__body}>
          <div className={styles.match_card__left}>
            <Typography.Text strong>{data.pairOfTeams[0].name}</Typography.Text>
            <Image
              src={data.pairOfTeams[0].avatar}
              alt={data.pairOfTeams[0].name}
              width={32}
              height={32}
            />
          </div>
          <Space style={{ fontSize: '20px' }}>
            {`${data.pairOfTeams[0].goalsScored} - ${data.pairOfTeams[1].goalsScored}`}
          </Space>
          <div className={styles.match_card__right}>
            <Image
              src={data.pairOfTeams[1].avatar}
              alt={data.pairOfTeams[1].name}
              width={32}
              height={32}
            />
            <Typography.Text strong>{data.pairOfTeams[1].name}</Typography.Text>
          </div>
        </div>
        <div>
          <Typography.Link onClick={onClickViewMore}>xem thêm</Typography.Link>
        </div>
      </Card>
      <Modal
        className={styles.match_modal}
        visible={visible}
        width={800}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <div style={{ marginBottom: '20px' }}>
          <Typography.Text type='secondary' style={{ fontSize: '18px' }}>
            Bảng {data.group} -{' '}
            <Typography.Text type='secondary' style={{ fontSize: '14px' }}>
              {moment().format('dddd, DD/MM/YYYY')}
            </Typography.Text>
          </Typography.Text>
        </div>
        <div className={styles.match_modal__body}>
          <div className={styles.match_modal__left}>
            <Typography.Text strong>{data.pairOfTeams[0].name}</Typography.Text>
            <Image
              src={data.pairOfTeams[0].avatar}
              alt={data.pairOfTeams[0].name}
              width={64}
              height={64}
            />
          </div>
          <Space style={{ fontSize: '32px' }}>
            {`${data.pairOfTeams[0].goalsScored} - ${data.pairOfTeams[1].goalsScored}`}
          </Space>
          <div className={styles.match_modal__right}>
            <Image
              src={data.pairOfTeams[1].avatar}
              alt={data.pairOfTeams[1].name}
              width={64}
              height={64}
            />
            <Typography.Text strong>{data.pairOfTeams[1].name}</Typography.Text>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default MatchCard;
