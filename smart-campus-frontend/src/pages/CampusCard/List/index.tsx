import React, { useRef, useState } from 'react';
import { ActionType, type ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Input, InputNumber, message, Modal, Popconfirm } from 'antd';
import {
  addCampusCard,
  deleteCampusCardById,
  listCampusCardByPage,
  updateCampusCardById,
} from '@/services/smart-campus/campusCardController';
import { CreditCardOutlined, UserOutlined } from '@ant-design/icons';

const CampusCardList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [id, setId] = useState('');
  const [balance, setBalance] = useState(0);
  const columns: ProColumns<API.CampusCard>[] = [
    {
      title: '卡号',
      dataIndex: 'cardId',
      // tip: 'The rule name is the unique key',
      render: (dom) => {
        return <a onClick={() => {}}>{dom}</a>;
      },
      hideInSearch: true,
    },
    {
      title: '工号/学号',
      dataIndex: 'userId',
      valueType: 'text',
    },
    {
      title: '余额',
      dataIndex: 'balance',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'isLost',
      valueEnum: {
        0: {
          text: '正常',
          status: 'Success',
        },
        1: {
          text: '挂失',
          status: 'Error',
        },
      },
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key={'recharge'}
          onClick={() => {
            setIsRechargeModalOpen(true);
            setId(record.cardId as string);
          }}
        >
          充值
        </a>,
        <Popconfirm
          title="挂失校园卡"
          onConfirm={async () => {
            try {
              await updateCampusCardById(
                { id: record.cardId as any },
                { isLost: record.isLost === 0 ? 1 : 0 },
              );
              message.success(`${record.isLost === 1 ? '取消挂失' : '挂失'}成功`);
              actionRef.current?.reload(); // 重新加载表格数据
            } catch (error: any) {
              message.error(error.message);
            }
          }}
          description="你确定要挂失此校园卡吗?"
          okText="是"
          cancelText="否"
          key={'isLost'}
        >
          <a>{`${record.isLost === 0 ? '挂失' : '取消挂失'}`}</a>
        </Popconfirm>,
        <Popconfirm
          title="注销校园卡"
          onConfirm={async () => {
            try {
              await deleteCampusCardById({ id: record.cardId as any });
              message.success('注销成功！');
              actionRef.current?.reload(); // 重新加载表格数据
            } catch (error: any) {
              message.error(error.message);
            }
          }}
          description="你确定要注销此校园卡吗?"
          okText="是"
          cancelText="否"
          key={'delete'}
        >
          <a>注销</a>
        </Popconfirm>,
      ],
    },
  ];
  const handleRecharge = async () => {
    setRechargeLoading(true);
    try {
      await updateCampusCardById({ id }, { balance });
      message.success('充值成功！');
      setId('');
      setBalance(0);
      actionRef.current?.reload();
      setIsRechargeModalOpen(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setRechargeLoading(false);
    }
  };
  const handleAdd = async () => {
    setAddLoading(true);
    try {
      await addCampusCard({ userId });
      message.success('添加成功！');
      setUserId('');
      actionRef.current?.reload();
      setIsAddModalOpen(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setAddLoading(false);
    }
  };
  return (
    <>
      <ProTable<API.CampusCard, API.CampusCardQueryRequest>
        actionRef={actionRef}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params: API.CampusCardQueryRequest,
        ) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const msg = await listCampusCardByPage({
            current: params.current,
            pageSize: params.pageSize,
            userId: params.userId,
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
            onClick={() => setIsAddModalOpen(true)}
            size={'large'}
            key="add"
            type={'primary'}
            icon={<CreditCardOutlined />}
          >
            添加校园卡
          </Button>,
        ]}
      />
      <Modal
        title="充值余额"
        open={isRechargeModalOpen}
        onOk={handleRecharge}
        confirmLoading={rechargeLoading}
        onCancel={() => setIsRechargeModalOpen(false)}
      >
        <InputNumber
          onChange={(value: number | null) => {
            // 直接使用 value 参数，不是 event 对象
            setBalance(value || 0); // 处理可能的 null 值
          }}
          value={balance}
          style={{ width: '100%' }}
          size={'large'}
          prefix="¥"
          defaultValue={0}
        />
      </Modal>
      <Modal
        title="创建校园卡"
        open={isAddModalOpen}
        onOk={handleAdd}
        confirmLoading={addLoading}
        onCancel={() => setIsAddModalOpen(false)}
      >
        <Input
          size="large"
          placeholder="请输入工号/学号"
          prefix={<UserOutlined />}
          value={userId} // 绑定值
          onChange={(e: any) => setUserId(e.target.value)} // 更新状态
        />
      </Modal>
    </>
  );
};

export default CampusCardList;
