import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { listTransactionByPage } from '@/services/smart-campus/campusCardController';

const Record: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.Transaction>[] = [
    {
      title: 'id',
      dataIndex: 'transactionId',
      // tip: 'The rule name is the unique key',
      render: (dom) => {
        return <a onClick={() => {}}>{dom}</a>;
      },
      hideInSearch: true,
    },
    {
      title: '交易类型',
      dataIndex: 'type',
      valueEnum: {
        RECHARGE: {
          text: '充值', // ADMIN → 管理员
          status: 'Success',
        },
        SPEND: {
          text: '消费', // TEACHER → 职工
          status: 'Processing',
        },
      },
      hideInSearch: true,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '交易时间',
      dataIndex: 'timestamp',
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ];
  return (
    <>
      <h2>我的校园卡记录</h2>
      <ProTable<API.Transaction, API.CampusCardQueryRequest>
        actionRef={actionRef}
        search={false}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params: API.CampusCardQueryRequest,
        ) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const msg = await listTransactionByPage({
            current: params.current,
            pageSize: params.pageSize,
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
    </>
  );
};

export default Record;
