import React, { useRef } from 'react';
import { deleteUserById, getStudentListByClassId } from '@/services/smart-campus/userController';
import { ActionType, type ProColumns, ProTable } from '@ant-design/pro-components';
import { Avatar, Button, message, Popconfirm } from 'antd';
import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { history, Link } from '@umijs/max';
import { useParams } from '@@/exports';
import { useModel } from '@@/plugin-model';

const UserList: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const columns: ProColumns<API.UserVO>[] = [
    {
      title: '照片',
      dataIndex: 'userAvatar',
      render: (_, record) => {
        // 如果 userAvatar 为空或不存在，则显示默认图片
        return (
          <Avatar shape="square" src={record.userAvatar} size="large" icon={<UserOutlined />} />
        );
      },
      valueType: 'avatar',
      hideInSearch: true,
    },
    {
      title: '学号',
      dataIndex: 'userId',
      // tip: 'The rule name is the unique key',
      render: (dom) => {
        return <a onClick={() => {}}>{dom}</a>;
      },
    },
    {
      title: '名称',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        currentUser?.role === 'ADMIN' && (
          <Link key={'edit'} to={`/class/studentAddOrUpdate/${record.userId}`}>
            编辑
          </Link>
        ),
        currentUser?.role === 'ADMIN' && (
          <Popconfirm
            title="删除学生"
            onConfirm={async () => {
              try {
                await deleteUserById({ id: record.userId as any });
                message.success('删除成功！');
                actionRef.current?.reload(); // 重新加载表格数据
              } catch (error: any) {
                message.error(error.message);
              }
            }}
            description="你确定要删除此学生吗?"
            okText="是"
            cancelText="否"
            key={'delete'}
          >
            <a>删除</a>
          </Popconfirm>
        ),
      ],
    },
  ];
  return (
    <ProTable<API.UserVO, API.UserQueryRequest>
      // params 是需要自带的参数
      // 这个参数优先级更高，会覆盖查询表单的参数
      // params={params}
      actionRef={actionRef}
      request={async (
        // 第一个参数 params 查询表单和 params 参数的结合
        // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
        params: API.UserQueryRequest,
      ) => {
        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
        // 如果需要转化参数可以在这里进行修改
        const msg = await getStudentListByClassId({
          classId: id,
          current: params.current,
          pageSize: params.pageSize,
          role: params.role,
          userId: params.userId,
          userName: params.userName,
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
        currentUser?.role === 'ADMIN' && (
          <Button
            onClick={() => {
              history.push(`/class/studentAddOrUpdate/${id}`, {
                from: history.location.pathname + history.location.search,
              });
            }}
            size={'large'}
            key="add"
            type={'primary'}
            icon={<UserAddOutlined />}
          >
            添加学生
          </Button>
        ),
      ]}
    />
  );
};

export default UserList;
