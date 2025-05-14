import React, { useRef } from 'react';
import { ActionType, type ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { history, Link } from '@umijs/max';
import { deleteCollegeById, listCollegeByPage } from '@/services/smart-campus/collegeController';
import { BankOutlined } from '@ant-design/icons';

const CollegeList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.College>[] = [
    {
      title: '学院编号',
      dataIndex: 'collegeId',
      // tip: 'The rule name is the unique key',
      render: (dom) => {
        return <a onClick={() => {}}>{dom}</a>;
      },
    },
    {
      title: '学院名称',
      dataIndex: 'collegeName',
      valueType: 'text',
    },
    {
      title: '学院简介',
      dataIndex: 'description',
      valueType: 'textarea',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Link key={'edit'} to={`/college/addOrUpdate/${record.collegeId}`}>
          编辑
        </Link>,
        <Popconfirm
          title="删除学院"
          onConfirm={async () => {
            try {
              await deleteCollegeById({ id: record.collegeId as any });
              message.success('删除成功！');
              actionRef.current?.reload(); // 重新加载表格数据
            } catch (error: any) {
              message.error(error.message);
            }
          }}
          description="你确定要删除此学院吗?"
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
    <ProTable<API.College, API.CollegeQueryRequest>
      actionRef={actionRef}
      request={async (
        // 第一个参数 params 查询表单和 params 参数的结合
        // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
        params: API.CollegeQueryRequest,
      ) => {
        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
        // 如果需要转化参数可以在这里进行修改
        const msg = await listCollegeByPage({
          current: params.current,
          pageSize: params.pageSize,
          collegeId: params.collegeId,
          collegeName: params.collegeName,
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
            history.push('/college/addOrUpdate', {
              from: history.location.pathname + history.location.search,
            });
          }}
          size={'large'}
          key="add"
          type={'primary'}
          icon={<BankOutlined />}
        >
          添加学院
        </Button>,
      ]}
    />
  );
};

export default CollegeList;
