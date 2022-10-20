import { SearchOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select } from 'antd';
import _ from 'lodash';
import { PitchType } from 'types';
import moment from 'moment';
import { useRouter } from 'next/router';
import { DATE_FORMAT } from 'constant';
import { RangePickerProps } from 'antd/lib/date-picker';
import qs from 'query-string';

export type FilterParams = {
  search?: string;
  date?: moment.Moment;
  time?: string;
  type?: PitchType;
};

type Props = {
  loading?: boolean;
};

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return (
    current &&
    (current < moment().startOf('day') ||
      current > moment().add(7, 'days').endOf('day'))
  );
};

function genTimeDurations() {
  const durations: string[] = [];
  new Array(24).fill(0).forEach((_v, index) => {
    const start = moment({ hour: index, minute: 30 });
    const end = start.clone().add(1, 'h');
    durations.push(start.format('HH:mm') + ' - ' + end.format('HH:mm'));
  });
  return durations;
}

const PitchFilter = (props: Props) => {
  const [form] = Form.useForm<FilterParams>();
  const router = useRouter();
  const initialValues = {
    search: router.query.search,
    date: router.query.date ? moment(router.query.date, DATE_FORMAT) : moment(),
    time: router.query.time,
    type: router.query.type,
  };

  const onFinish = (values: FilterParams) => {
    const query = router.query;
    query.search = values.search;
    query.date = values.date?.format('DD/MM/YYYY');
    query.time = values.time;
    query.type = values.type;
    router.push({
      query: _.omitBy(query, _.isNil),
    });
    // values.search = values.search || undefined;
    // const newSearchParams = {
    //   page: paramsObj.page as any,
    //   ...values,
    // };
    // setSearchParams(_.omitBy(newSearchParams, _.isNil));
  };

  return (
    <Form
      form={form}
      name='pitch_filter'
      layout='inline'
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item name='search'>
        <Input
          prefix={<SearchOutlined />}
          allowClear
          size='large'
          placeholder='Địa điểm cho thuê'
          style={{ minWidth: 320 }}
        />
      </Form.Item>
      <div style={{ flex: 1 }}></div>
      <Form.Item name='date'>
        <DatePicker
          format={DATE_FORMAT}
          disabledDate={disabledDate}
          size='large'
          allowClear={false}
        />
      </Form.Item>
      <Form.Item name='time'>
        <Select
          style={{ width: 150 }}
          size='large'
          placeholder='Khung giờ'
          allowClear
        >
          {_.map(genTimeDurations(), (time) => (
            <Select.Option ket={time} value={time}>
              {time}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='type'>
        <Select
          style={{ width: 120 }}
          size='large'
          placeholder='Loại sân'
          allowClear
        >
          <Select.Option value={PitchType.FIVE_A_SIDE}>5 vs 5</Select.Option>
          <Select.Option value={PitchType.SEVEN_A_SIDE}>7 vs 7</Select.Option>
          <Select.Option value={PitchType.ELEVEN_A_SIDE}>
            11 vs 11
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item style={{ marginRight: '0' }}>
        <Button
          type='primary'
          htmlType='submit'
          size='large'
          loading={props.loading}
        >
          Tìm kiếm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PitchFilter;
