import React, { useEffect, useRef, useState } from 'react';
import { ActionType, type ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { history, Link } from '@umijs/max';
import { deleteClassById, listClassByPage } from '@/services/smart-campus/classController';
import { FundProjectionScreenOutlined } from '@ant-design/icons';
import { listMajor } from '@/services/smart-campus/majorController';
import { getTeacherList } from '@/services/smart-campus/userController';
import { useModel } from '@@/plugin-model';

const ClassList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [majorList, setMajorList] = useState<API.Major[]>([]);
  const [loading, setLoading] = useState(false);
  const [teacherList, setTeacherList] = useState<API.UserVO[]>([]);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};

  useEffect(() => {
    const fetchMajorData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const response = await listMajor();
        const res = await getTeacherList();
        setTeacherList(res.data as any);
        setMajorList(response.data as any);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMajorData();
  }, []); // 空依赖数组表示仅执行一次
  const columns: ProColumns<API.Class>[] = [
    {
      title: '班级编号',
      dataIndex: 'classId',
      // tip: 'The rule name is the unique key',
      render: (dom) => {
        return <a onClick={() => {}}>{dom}</a>;
      },
    },
    {
      title: '所属专业',
      dataIndex: 'majorId',
      valueType: 'select', // 关键属性
      search: {
        transform: (value) => ({ majorId: value }), // 参数转换
      },
      fieldProps: {
        // 下拉框配置
        options: majorList.map((major) => ({
          label: major.majorName,
          value: major.majorId,
        })),
        showSearch: true, // 启用搜索功能
        optionFilterProp: 'label', // 按学院名称过滤
      },
      // 原有render保持不动
      render: (_, record) => {
        return majorList.find((item) => item.majorId === record.majorId)?.majorName;
      },
    },
    {
      title: '班主任',
      dataIndex: 'headTeacherId',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return teacherList.find((item) => item.userId === record.headTeacherId)?.userName;
      },
    },
    {
      title: '入学年份',
      dataIndex: 'admissionYear',
      valueType: 'dateYear',
      hideInSearch: true,
    },
    {
      title: '学生人数',
      dataIndex: 'studentCount',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Link key={'edit'} to={`/class/student/${record.classId}`}>
          管理学生
        </Link>,
        currentUser?.role === 'ADMIN' && (
          <Link key={'edit'} to={`/class/addOrUpdate/${record.classId}`}>
            编辑
          </Link>
        ),
        currentUser?.role === 'ADMIN' && (
          <Popconfirm
            title="删除班级"
            onConfirm={async () => {
              try {
                await deleteClassById({ id: record.classId as any });
                message.success('删除成功！');
                actionRef.current?.reload(); // 重新加载表格数据
              } catch (error: any) {
                message.error(error.message);
              }
            }}
            description="你确定要删除此班级吗?"
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
    <ProTable<API.Class, API.ClassQueryRequest>
      loading={loading}
      actionRef={actionRef}
      request={async (
        // 第一个参数 params 查询表单和 params 参数的结合
        // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
        params: API.ClassQueryRequest,
      ) => {
        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
        // 如果需要转化参数可以在这里进行修改
        const msg = await listClassByPage({
          current: params.current,
          pageSize: params.pageSize,
          majorId: params.majorId,
          headTeacherId:
            currentUser?.role === 'TEACHER' ? currentUser.userId : params.headTeacherId,
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
              history.push('/class/addOrUpdate', {
                from: history.location.pathname + history.location.search,
              });
            }}
            size={'large'}
            key="add"
            type={'primary'}
            icon={<FundProjectionScreenOutlined />}
          >
            添加班级
          </Button>
        ),
      ]}
    />
  );
};

export default ClassList;
