import { deleteCourseById, listCourseByPage } from '@/services/smart-campus/courseController';
import { ReadOutlined } from '@ant-design/icons';
import { ActionType, type ProColumns, ProTable } from '@ant-design/pro-components';
import { history, Link } from '@umijs/max';
import { Button, message, Popconfirm, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getTeacherList } from '@/services/smart-campus/userController';

const CourseList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [teacherList, setTeacherList] = useState<API.UserVO[]>([]);
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // 替换为你的API请求
        const res = await getTeacherList();
        setTeacherList(res.data as any);
      } catch (error: any) {
        message.error(error.message);
      }
    };
    fetchTeacherData();
  }, []); // 空依赖数组表示仅执行一次
  const columns: ProColumns<API.Course>[] = [
    {
      title: '课程编号',
      dataIndex: 'courseId',
      // tip: 'The rule name is the unique key',
      render: (dom) => {
        return <a onClick={() => {}}>{dom}</a>;
      },
      hideInSearch: true,
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      valueType: 'text',
    },
    {
      title: '学期',
      dataIndex: 'semester',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '学分',
      dataIndex: 'credit',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '学时',
      dataIndex: 'hours',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '教师工号',
      dataIndex: 'teacherId',
      render: (_, record) => {
        return <div>{teacherList.find((item) => item.userId === record.teacherId)?.userName}</div>;
      },
    },
    {
      title: '最大选课人数',
      dataIndex: 'maxCapacity',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      hideInSearch: true,
      title: '时间安排',
      children: [
        {
          title: '周次范围',
          dataIndex: ['schedule', 'weeks'],
          render: (text) => text || '-',
        },
        {
          title: '星期',
          dataIndex: ['schedule', 'weekdays'],
          render: (weekdays) =>
            weekdays
              //@ts-ignore
              ?.split(',')
              .map((day: any) => (
                <Tag key={day}>
                  {['周一', '周二', '周三', '周四', '周五', '周六', '周日'][day - 1]}
                </Tag>
              )),
        },
        {
          title: '节次',
          dataIndex: ['schedule', 'sections'],
          render: (text) => (text ? `${text}节` : '-'),
        },
        {
          title: '备注',
          dataIndex: ['schedule', 'remark'],
          render: (text) => text,
        },
      ],
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
        <Link key={'edit'} to={`/course/addOrUpdate/${record.courseId}`}>
          编辑
        </Link>,
        <Popconfirm
          title="删除课程"
          onConfirm={async () => {
            try {
              await deleteCourseById({ id: record.courseId as any });
              message.success('删除成功！');
              actionRef.current?.reload(); // 重新加载表格数据
            } catch (error: any) {
              message.error(error.message);
            }
          }}
          description="你确定要删除此课程吗?"
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
    <ProTable<API.Course, API.CourseQueryRequest>
      actionRef={actionRef}
      request={async (
        // 第一个参数 params 查询表单和 params 参数的结合
        // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
        params: API.CourseQueryRequest,
      ) => {
        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
        // 如果需要转化参数可以在这里进行修改
        const msg = await listCourseByPage({
          current: params.current,
          pageSize: params.pageSize,
          teacherId: params.teacherId,
          courseName: params.courseName,
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
            history.push('/course/addOrUpdate', {
              from: history.location.pathname + history.location.search,
            });
          }}
          size={'large'}
          key="add"
          type={'primary'}
          icon={<ReadOutlined />}
        >
          添加课程
        </Button>,
      ]}
    />
  );
};

export default CourseList;
