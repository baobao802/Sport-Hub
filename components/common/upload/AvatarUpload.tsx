import { SmileOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Avatar,
  AvatarProps,
  Button,
  message,
  Upload,
  UploadProps,
} from 'antd';
import React, { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload';

interface Props extends AvatarProps {
  onChange?: (value: string) => void;
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const AvatarUpload = (props: Props) => {
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === 'uploading') {
      // setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      props.onChange && props.onChange(info.file.response.url);
      setImageUrl(info.file.response.url);
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        // setLoading(false);
        // console.log(url);
      });
    }
  };

  const uploadProps: UploadProps = {
    action: `${process.env.NEXT_PUBLIC_API_URL}/files/upload`,
    listType: 'picture',
    showUploadList: false,
    beforeUpload,
    onChange: handleChange,
  };

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <Avatar size={128} src={imageUrl} icon={<SmileOutlined />} {...props} />
      <span style={{ position: 'absolute', bottom: 0, right: 0 }}>
        <ImgCrop>
          <Upload {...uploadProps}>
            <Button
              type='dashed'
              icon={<UploadOutlined />}
              style={{ background: 'transparent' }}
            />
          </Upload>
        </ImgCrop>
      </span>
    </div>
  );
};

export default AvatarUpload;
