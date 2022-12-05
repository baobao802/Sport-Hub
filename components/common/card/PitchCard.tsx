import { Badge, Card, Checkbox, DatePicker, Modal, Space, Spin } from 'antd';
import type {
  CheckboxOptionType,
  CheckboxValueType,
} from 'antd/lib/checkbox/Group';
import { Booking, Pitch, PitchType, RequestBookingParams } from 'types';
import { DatePickerProps, RangePickerProps } from 'antd/lib/date-picker';
import { DATE_FORMAT } from 'constant';
import moment from 'moment';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { getSuccessBooking } from '@services/bookingApi';
import { useGlobalContext } from 'contexts/global';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

interface Props {
  data: Pitch;
  options: CheckboxOptionType[];
  selected?: string;
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
  const { data, options, selected, onSelect } = props;
  const { currentCity } = useGlobalContext();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>();
  const [date, setDate] = useState<string>(() => moment().format(DATE_FORMAT));
  const successBookings = useQuery<Booking[]>({
    queryKey: [
      'successBookings',
      { date, pitchId: data.id, cityId: currentCity?.id },
    ],
    queryFn: ({ queryKey }) =>
      getSuccessBooking(queryKey[1] as RequestBookingParams),
    enabled: visible,
  });
  const defaultValues = useMemo(
    () => _.map(successBookings.data, ({ cost }) => cost.time),
    [successBookings.data],
  );
  const mappedOptions = useMemo(
    () =>
      _.map(options, (option: CheckboxOptionType) => {
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
      }),
    [options, defaultValues, date],
  );

  const onDateChange: DatePickerProps['onChange'] = (_date, dateString) => {
    setDate(dateString);
  };

  const handleOk = () => {
    setVisible(false);
    if (onSelect) {
      const found = _.find(data.cost, ({ time }) => time === selectedValue);
      found && onSelect({ time: found.time, cost: found.value, date });
    }
    delete router.query.pitchId;
    router.push({ query: router.query });
  };

  const handleCancel = () => {
    setVisible(false);
    if (onSelect) {
      onSelect(undefined);
    }
    delete router.query.pitchId;
    router.push({ query: router.query });
  };

  const handleSelectValues = (values: CheckboxValueType[]) => {
    const selected = _.difference(
      values,
      [...defaultValues, selectedValue] || [],
    )[0] as string;
    setSelectedValue(selected);
  };

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
            {data.name}, ngày{' '}
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
        {successBookings.isError ? (
          'Something go wrong!'
        ) : successBookings.isLoading ? (
          <Space
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '20px',
              height: '200px',
            }}
          >
            <Spin size='large' />
          </Space>
        ) : (
          <Checkbox.Group
            options={mappedOptions}
            defaultValue={defaultValues}
            value={[...defaultValues, selectedValue] as CheckboxValueType[]}
            onChange={handleSelectValues}
          />
        )}
      </Modal>
      <Card
        hoverable
        style={selected === data.id ? { borderColor: 'violet' } : undefined}
        onClick={() => {
          setVisible(true);
          router.query.pitchId = data.id;
          router.push({ query: router.query });
        }}
      >
        {data.name}
      </Card>
    </Badge.Ribbon>
  );
};

export default PitchCard;
