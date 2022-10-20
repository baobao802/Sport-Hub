import { SmileOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
} from 'antd';
import { useGlobalContext } from 'contexts/global';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { City, ClubDetails } from 'types';
import { AvatarUpload } from '../upload';

export type FormValues = Pick<ClubDetails, 'name' | 'avatar'> & {
  telephone: string;
  street: string;
  district: {
    value: number;
    label: string;
  };
  city: {
    value: number;
    label: string;
  };
};

type Props = {
  onSubmit?: (values: FormValues) => void;
};

const CreateClubForm = (props: Props) => {
  const { cities, currentCity } = useGlobalContext();
  const formRef = useRef<FormInstance<FormValues>>(null);
  const [selectedCity, setSelectedCity] = useState<
    Omit<City, 'districts'> | undefined
  >();
  const districts = _.find(
    cities,
    (city) => city.id === selectedCity?.id,
  )?.districts;

  const onChange = (_value: string, option: any) => {
    setSelectedCity({
      id: option.value,
      name: option.children,
    });
    formRef.current?.setFieldValue('district', undefined);
  };

  useEffect(() => {
    if (currentCity) {
      setSelectedCity(currentCity);
      formRef.current?.setFieldValue('city', currentCity.id);
    }
  }, [currentCity]);

  return (
    <Form<FormValues> ref={formRef} layout='vertical' onFinish={props.onSubmit}>
      <Form.Item name='avatar' style={{ textAlign: 'center' }}>
        <AvatarUpload />
      </Form.Item>
      <Row gutter={[10, 10]}>
        <Col sm={24} md={12}>
          <Form.Item
            name='name'
            label='Tên CLB'
            rules={[
              { required: true, message: 'Không bỏ trống' },
              {
                max: 24,
                message: 'Quá dài',
              },
            ]}
          >
            <Input autoComplete='off' />
          </Form.Item>
        </Col>
        <Col sm={24} md={12}>
          <Form.Item
            name='telephone'
            label='Số điện thoại'
            rules={[
              { required: true, message: 'Không bỏ trống' },
              {
                pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                message: 'không hợp lệ',
              },
            ]}
          >
            <Input autoComplete='off' />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[10, 10]}>
        <Col sm={24} md={12}>
          <Form.Item
            name='city'
            label='Thành phố'
            rules={[{ required: true, message: 'Không bỏ trống' }]}
          >
            <Select
              showSearch
              labelInValue
              placeholder='Chọn Thành phố'
              optionFilterProp='children'
              onChange={onChange}
              filterOption={(input, option) =>
                (option!.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {_.map(cities, (city) => (
                <Select.Option key={city.id} value={city.id}>
                  {city.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col sm={24} md={12}>
          <Form.Item
            name='district'
            label='Quận/Huyện'
            rules={[{ required: true, message: 'Không bỏ trống' }]}
          >
            <Select
              showSearch
              labelInValue
              placeholder='Chọn quận/huyện'
              optionFilterProp='children'
              filterOption={(input, option) =>
                (option!.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {_.map(districts, (district) => (
                <Select.Option key={district.id} value={district.id}>
                  {district.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name='street' label='Đường phố'>
        <Input autoComplete='off' />
      </Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Button type='primary' htmlType='submit'>
          Gửi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateClubForm;
