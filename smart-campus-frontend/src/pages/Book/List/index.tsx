import React, { useRef } from 'react';
import { ActionType, type ProColumns, ProTable } from '@ant-design/pro-components';
import { Avatar, Button, message, Popconfirm } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { history, Link } from '@umijs/max';
import { deleteBookById, listBookByPage } from '@/services/smart-campus/bookController';

const BookList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.Book>[] = [
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
      title: '简介',
      dataIndex: 'description',
      valueType: 'textarea',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '出版社',
      dataIndex: 'publisherName',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '出版时间',
      dataIndex: 'publishDate',
      valueType: 'date',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '馆藏总量',
      dataIndex: 'total',
      valueType: 'digit',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '借出数量',
      dataIndex: 'borrowedNum',
      valueType: 'digit',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Link key={'edit'} to={`/book/addOrUpdate/${record.bookId}`}>
          编辑
        </Link>,
        <Popconfirm
          title="删除图书"
          onConfirm={async () => {
            try {
              await deleteBookById({ id: record.bookId as any });
              message.success('删除成功！');
              actionRef.current?.reload(); // 重新加载表格数据
            } catch (error: any) {
              message.error(error.message);
            }
          }}
          description="你确定要删除此图书吗?"
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
    <ProTable<API.Book, API.BookQueryRequest>
      actionRef={actionRef}
      request={async (
        // 第一个参数 params 查询表单和 params 参数的结合
        // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
        params: API.BookQueryRequest,
      ) => {
        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
        // 如果需要转化参数可以在这里进行修改
        const msg = await listBookByPage({
          current: params.current,
          pageSize: params.pageSize,
          status: params.status,
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
      toolBarRender={() => [
        <Button
          onClick={() => {
            history.push('/book/addOrUpdate', {
              from: history.location.pathname + history.location.search,
            });
          }}
          size={'large'}
          key="add"
          type={'primary'}
          icon={<BookOutlined />}
        >
          添加图书
        </Button>,
      ]}
    />
  );
};

export default BookList;
