import { deleteSurveyById, listSurveyByPage } from '@/services/smart-campus/surveyController';
import { SnippetsOutlined } from '@ant-design/icons';
import { ActionType, type ProColumns, ProTable } from '@ant-design/pro-components';
import { history, Link } from '@umijs/max';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef } from 'react';

const SurveyList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.Survey>[] = [
    {
      title: 'id',
      dataIndex: 'surveyId',
      // tip: 'The rule name is the unique key',
      render: (dom) => {
        return <a onClick={() => {}}>{dom}</a>;
      },
      hideInSearch: true,
    },
    {
      title: '问卷标题',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '创建者工号',
      dataIndex: 'creatorId',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '上课地点',
      dataIndex: 'location',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Link key={'edit'} to={`/survey/addOrUpdate/${record.surveyId}`}>
          编辑
        </Link>,
        <Popconfirm
          title="删除问卷"
          onConfirm={async () => {
            try {
              await deleteSurveyById({ id: record.surveyId as any });
              message.success('删除成功！');
              actionRef.current?.reload(); // 重新加载表格数据
            } catch (error: any) {
              message.error(error.message);
            }
          }}
          description="你确定要删除此问卷吗?"
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
    <ProTable<API.Survey, API.SurveyQueryRequest>
      actionRef={actionRef}
      request={async (
        // 第一个参数 params 查询表单和 params 参数的结合
        // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
        params: API.SurveyQueryRequest,
      ) => {
        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
        // 如果需要转化参数可以在这里进行修改
        const msg = await listSurveyByPage({
          current: params.current,
          pageSize: params.pageSize,
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
            history.push('/survey/addOrUpdate', {
              from: history.location.pathname + history.location.search,
            });
          }}
          size={'large'}
          key="add"
          type={'primary'}
          icon={<SnippetsOutlined />}
        >
          添加问卷
        </Button>,
      ]}
    />
  );
};

export default SurveyList;
