import { Button, message, Space, Table, Upload, UploadProps } from 'antd';
import React, { Fragment, useState } from 'react';
import type { ColumnsType } from 'antd/lib/table';
import type { ClubDetails, ClubMember } from 'types';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import _ from 'lodash';
import { useGlobalContext } from 'contexts/global';
import { RcFile } from 'antd/lib/upload';
import { updateClubById } from '@services/clubApi';

type Props = {
  clubDetails: ClubDetails;
  data?: ClubMember[];
};

const columns: ColumnsType<ClubMember> = [
  {
    title: 'Họ và tên',
    dataIndex: 'fullName',
  },
  {
    title: 'Năm sinh',
    dataIndex: 'yearOfBirth',
  },
  {
    title: 'Số áo',
    dataIndex: 'number',
  },
  {
    title: 'Vị trí',
    dataIndex: 'position',
  },
];

const ClubMembersTable = (props: Props) => {
  const [dataSource, setDataSource] = useState<ClubMember[]>(props.data || []);
  const { user } = useGlobalContext();
  const canUpdate = user?.email === props.clubDetails.manager.email;

  const uploadProps: UploadProps = {
    accept: '.xlsx',
    customRequest(options) {
      const { file } = options;
      if (typeof FileReader !== 'undefined') {
        const reader = new FileReader();
        if (!!reader.readAsBinaryString) {
          reader.readAsBinaryString(file as RcFile);
          reader.onload = async (e) => {
            const data = e.target?.result;
            const readData = XLSX.read(data, { type: 'binary' });
            const wsName = readData.SheetNames[0];
            const ws = readData.Sheets[wsName];
            const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 });
            const mappedData = _.map(
              _.drop(parsedData),
              (col: any, index): ClubMember => ({
                id: index,
                fullName: col[0],
                yearOfBirth: col[1],
                number: col[2],
                position: col[3],
              }),
            );
            try {
              await updateClubById(props.clubDetails.id, {
                members: mappedData,
              });
              setDataSource(mappedData);
              message.success('Cập nhật danh sách thành công.');
            } catch (error) {
              message.error('Cập nhật danh sách không thành công.');
            }
          };
        }
      }
    },
    showUploadList: false,
  };

  return (
    <Fragment>
      <Space
        style={{
          marginBottom: '10px',
          width: '100%',
          justifyContent: 'flex-end',
        }}
      >
        <Upload {...uploadProps}>
          <Button
            type='primary'
            icon={<UploadOutlined />}
            disabled={!canUpdate}
          >
            Import file
          </Button>
        </Upload>
        <a href='/template.xlsx' download>
          <Button icon={<DownloadOutlined />}>Template</Button>
        </a>
      </Space>
      <Table
        rowKey='id'
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </Fragment>
  );
};

export default ClubMembersTable;
