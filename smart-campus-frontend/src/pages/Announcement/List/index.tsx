import React, { useRef } from 'react';
import { ActionType, type ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { history, Link } from '@umijs/max';
import {
  deleteAnnouncementById,
  listAnnouncementByPage,
} from '@/services/smart-campus/announcementController';
import { BellOutlined } from '@ant-design/icons';

const AnnouncementList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.Announcement>[] = [
    {
      title: 'id',
      dataIndex: 'announcementId',
      // tip: 'The rule name is the unique key',
      render: (dom) => {
        return <a onClick={() => {}}>{dom}</a>;
      },
      hideInSearch: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '目标',
      dataIndex: 'target',
      valueEnum: {
        ALL: {
          text: '全体',
          status: 'Error',
        },
        STUDENT: {
          text: '学生',
          status: 'Success',
        },
        TEACHER: {
          text: '职工',
          status: 'Processing',
        },
      },
    },
    {
      title: '发布人工号',
      dataIndex: 'publisherId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Link key={'edit'} to={`/announcement/addOrUpdate/${record.announcementId}`}>
          编辑
        </Link>,
        <Popconfirm
          title="删除公告"
          onConfirm={async () => {
            try {
              await deleteAnnouncementById({ id: record.announcementId as any });
              message.success('删除成功！');
              actionRef.current?.reload(); // 重新加载表格数据
            } catch (error: any) {
              message.error(error.message);
            }
          }}
          description="你确定要删除此公告吗?"
          okText="是"
          cancelText="否"
          key={'delete'}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <ProTable<API.Announcement, API.AnnouncementQueryRequest>
      actionRef={actionRef}
      request={async (
        // 第一个参数 params 查询表单和 params 参数的结合
        // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
        params: API.AnnouncementQueryRequest,
      ) => {
        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
        // 如果需要转化参数可以在这里进行修改
        const msg = await listAnnouncementByPage({
          current: params.current,
          pageSize: params.pageSize,
          target: params.target,
          title: params.title,
        });
        return {
          data: msg.data?.records,
          // success 请返回 true，
          // 不然 table 会停止解析数据，即使有数据
          success: true,
          // 不传会使用 data 的长度，如果是分页一定要传
          total: msg.data?.total,
        };
      }}
      columns={columns}
      toolBarRender={() => [
        <Button
          onClick={() => {
            history.push('/announcement/addOrUpdate', {
              from: history.location.pathname + history.location.search,
            });
          }}
          size={'large'}
          key="add"
          type={'primary'}
          icon={<BellOutlined />}
        >
          添加公告
        </Button>,
      ]}
    />
  );
};

export default AnnouncementList;
