import { Badge, Card, Checkbox, DatePicker, Modal } from 'antd';
import type {
  CheckboxOptionType,
  CheckboxValueType,
} from 'antd/lib/checkbox/Group';
import {
  Booking,
  BookingStatus,
  Pitch,
  PitchType,
  RequestBookingParams,
} from 'types';
import { DatePickerProps, RangePickerProps } from 'antd/lib/date-picker';
import { DATE_FORMAT } from 'constant';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
import _ from 'lodash';
import { getSuccessBooking } from '@services/bookingApi';
import { useGlobalContext } from 'contexts/global';
import { useRouter } from 'next/router';

interface Props {
  data: Pitch;
  options: CheckboxOptionType[];
  onSelect?: (value?: any) => void;
}

export const mapPitchType = (type: PitchType) => {
  if (type === PitchType.FIVE_A_SIDE) {
    return {
      text: '5 vs 5',
      color: 'blue',
    };
  }
  if (type === PitchType.SEVEN_A_SIDE) {
    return {
      text: '7 vs 7',
      color: 'green',
    };
  }
  if (type === PitchType.ELEVEN_A_SIDE) {
    return {
      text: '11 vs 11',
      color: 'yellow',
    };
  }
};

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return (
    current &&
    (current < moment().startOf('day') ||
      current > moment().add(7, 'days').endOf('day'))
  );
};

const PitchCard = (props: Props) => {
  const { data, options, onSelect } = props;
  const { currentCity } = useGlobalContext();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>();
  const [date, setDate] = useState<string>(() => moment().format(DATE_FORMAT));
  const [successBookings, setSuccessBookings] = useState<Booking[]>();
  const defaultValues = _.map(successBookings, ({ time }) => time);
  const mappedOptions = _.map(options, (option: CheckboxOptionType) => {
    const hm = String(option.value).split(' - ')[0].split(':');
    return {
      ...option,
      disabled:
        _.includes(defaultValues, option.value) ||
        moment(date, DATE_FORMAT)
          .hour(Number(hm[0]))
          .minute(Number(hm[1]))
          .valueOf() <= moment().valueOf(),
    };
  });

  const onDateChange: DatePickerProps['onChange'] = (_date, dateString) => {
    setDate(dateString);
  };

  const handleOk = () => {
    setVisible(false);
    if (onSelect) {
      const found = _.find(data.cost, ({ time }) => time === selectedValue);
      found && onSelect({ time: found.time, cost: found.value, date });
    }
  };

  const handleCancel = () => {
    setVisible(false);
    if (onSelect) {
      onSelect(undefined);
    }
  };

  const handleSelectValues = (values: CheckboxValueType[]) => {
    const selected = _.difference(
      values,
      [...defaultValues, selectedValue] || [],
    )[0] as string;
    setSelectedValue(selected);
  };

  const fetchSuccessBooking = async () => {
    const params: RequestBookingParams = {
      date,
      pitchId: data.id,
      city: currentCity?.name,
    };
    const res = await getSuccessBooking(params);
    setSuccessBookings(res.items);
  };

  useEffect(() => {
    fetchSuccessBooking();
  }, [date]);

  useEffect(() => {
    if (String(data.id) === String(router.query?.pitchId)) {
      setVisible(true);
    }
  }, [data, router]);

  return (
    <Badge.Ribbon {...mapPitchType(data.type)}>
      <Modal
        title={
          <Fragment>
            Sân {data.name}, ngày{' '}
            <DatePicker
              format={DATE_FORMAT}
              defaultValue={moment()}
              disabledDate={disabledDate}
              onChange={onDateChange}
            />
          </Fragment>
        }
        visible={visible}
        width={800}
        okText='Chọn'
        cancelText='Bỏ chọn'
        okButtonProps={{
          disabled: !selectedValue,
        }}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Checkbox.Group
          options={mappedOptions}
          defaultValue={defaultValues}
          value={[...defaultValues, selectedValue] as CheckboxValueType[]}
          onChange={handleSelectValues}
        />
      </Modal>
      <Card hoverable onClick={() => setVisible(true)}>
        Sân {data.name}
      </Card>
    </Badge.Ribbon>
  );
};

export default PitchCard;
