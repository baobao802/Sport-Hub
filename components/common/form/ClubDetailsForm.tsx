import { Button, Form, Input, Space } from 'antd';
import React from 'react';
import type { ClubDetails } from 'types';

export type FormValues = Pick<ClubDetails, 'name' | 'bio'>;

type Props = {
  initialValues?: FormValues;
  onSubmit?: (values: FormValues) => void;
  onCancel?: () => void;
  submitting?: boolean;
};

const ClubDetailsForm = (props: Props) => {
  return (
    <Form
      layout='vertical'
      initialValues={props.initialValues}
      onFinish={props.onSubmit}
    >
      <Form.Item
        name='name'
        label='Tên CLB'
        rules={[{ required: true, message: 'Required!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name='bio' label='Tiểu sử'>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={props.onCancel}>Hủy</Button>
          <Button type='primary' htmlType='submit' loading={props.submitting}>
            Lưu
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ClubDetailsForm;
