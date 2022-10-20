import { SearchOutlined } from '@ant-design/icons';
import { Form, Input, Select } from 'antd';
import React from 'react';
import type { District } from 'types';

export type HubFilterParams = {
  search: string | undefined;
  district: District | undefined;
};

type Props = {
  onValuesChange?: (values: HubFilterParams) => void;
  districts: District[];
};

const HubFilter = (props: Props) => {
  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (props.onValuesChange) {
      props.onValuesChange({
        search: allValues.search,
        district: props.districts.find(({ id }) => id === allValues.district),
      });
    }
  };

  return (
    <Form
      layout='inline'
      style={{ justifyContent: 'space-between', marginBottom: '20px' }}
      onValuesChange={handleValuesChange}
    >
      <Form.Item name='search'>
        <Input
          placeholder='Tìm kiếm'
          prefix={<SearchOutlined />}
          size='large'
          style={{ minWidth: 320 }}
          allowClear
        />
      </Form.Item>
      <Form.Item name='district' style={{ marginRight: 0 }}>
        <Select placeholder='Quận' size='large' style={{ minWidth: 180 }}>
          {props.districts.map(({ id, name }) => (
            <Select.Option key={id} value={id}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default HubFilter;
