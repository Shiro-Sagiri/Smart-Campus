import { listCourseByPage } from '@/services/smart-campus/courseController';
import { ActionType, type ProColumns, ProTable } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Tag } from 'antd';
import React, { useRef } from 'react';
import { useModel } from '@@/exports';

const CourseList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
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
      title: '已选人数',
      dataIndex: 'selected',
      valueType: 'digit',
      hideInSearch: true,
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
        <Link key={'edit'} to={`/course/grade/${record.courseId}`}>
          成绩登记
        </Link>,
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
          teacherId: currentUser?.userId,
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
    />
  );
};

export default CourseList;
