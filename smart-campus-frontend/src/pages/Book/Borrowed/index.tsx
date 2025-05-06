import React, { useRef } from 'react';
import { ActionType, type ProColumns, ProTable } from '@ant-design/pro-components';
import { Avatar, message, Popconfirm, Tag } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import {
  listBorrowedBookByPage,
  payFine,
  returnBook,
} from '@/services/smart-campus/bookController';

const BookList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.BorrowedBookVO>[] = [
    {
      title: 'id',
      dataIndex: 'bookId',
      // tip: 'The rule name is the unique key',
      render: (dom) => {
        return <a onClick={() => {}}>{dom}</a>;
      },
      hideInSearch: true,
    },
    {
      title: '封面',
      dataIndex: 'cover',
      render: (_, record) => {
        // 如果 userAvatar 为空或不存在，则显示默认图片
        return <Avatar shape="square" src={record.cover} size="large" icon={<BookOutlined />} />;
      },
      valueType: 'avatar',
      hideInSearch: true,
    },
    {
      title: '书名',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '作者',
      dataIndex: 'author',
      valueType: 'text',
    },
    {
      title: '借阅时间',
      dataIndex: 'borrowTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '应还日期',
      dataIndex: 'dueTime',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '归还时间',
      dataIndex: 'returnTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '罚款金额',
      dataIndex: 'fine',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '是否缴纳',
      dataIndex: 'isPay',
      render: (_, record) => {
        // 如果 userAvatar 为空或不存在，则显示默认图片
        return (
          record.fine !== 0 && (
            <Tag color={record.isPay === 0 ? 'error' : 'success'}>
              {record.isPay === 0 ? '未缴纳' : '已缴纳'}
            </Tag>
          )
        );
      },
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        !record.returnTime && (
          <Popconfirm
            title="归还图书"
            onConfirm={async () => {
              try {
                await returnBook({ id: record.bookId as any });
                message.success('归还成功！');
                actionRef.current?.reload(); // 重新加载表格数据
              } catch (error: any) {
                message.error(error.message);
              }
            }}
            description="你确定要归还此图书吗?"
            okText="是"
            cancelText="否"
            key={'delete'}
          >
            <a>归还图书</a>
          </Popconfirm>
        ),
        record.fine !== 0 && !record.isPay && (
          <Popconfirm
            title="缴纳罚款"
            onConfirm={async () => {
              try {
                await payFine({ id: record.recordId as any });
                message.success('缴纳成功！');
                actionRef.current?.reload(); // 重新加载表格数据
              } catch (error: any) {
                message.error(error.message);
              }
            }}
            description="你确定要缴纳罚款吗?"
            okText="是"
            cancelText="否"
            key={'delete'}
          >
            <a>缴纳罚款</a>
          </Popconfirm>
        ),
      ],
    },
  ];
  return (
    <ProTable<API.BorrowedBookVO, API.BookQueryRequest>
      actionRef={actionRef}
      request={async (
        // 第一个参数 params 查询表单和 params 参数的结合
        // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
        params: API.BookQueryRequest,
      ) => {
        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
        // 如果需要转化参数可以在这里进行修改
        const msg = await listBorrowedBookByPage({
          current: params.current,
          pageSize: params.pageSize,
          title: params.title,
          author: params.author,
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
    />
  );
};

export default BookList;
