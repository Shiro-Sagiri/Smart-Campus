import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Progress, Tag } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import { listCourseByPage, selectCourse } from '@/services/smart-campus/courseController';
import { getTeacherList } from '@/services/smart-campus/userController';
import { useModel } from '@@/exports';

export default () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const actionRef = useRef<ActionType>();

  // 选课/退课操作
  const handleSelect = async (course: API.Course) => {
    try {
      await selectCourse({
        courseId: course.courseId as number,
        studentId: currentUser?.userId as string,
      });
      message.success(`已选课 ${course.courseName}`);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(error.message);
    }
  };
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
      title: '课程名称',
      dataIndex: 'courseName',
      render: (_, record) => <span className="text-lg">{record.courseName}</span>,
    },
    {
      hideInSearch: true,
      title: '任课教师',
      dataIndex: 'teacherId',
      render: (_, record) => {
        return <div>{teacherList.find((item) => item.userId === record.teacherId)?.userName}</div>;
      },
    },
    {
      hideInSearch: true,
      title: '学分',
      dataIndex: 'credit',
      render: (val) => <span className="font-semibold">{val} 学分</span>,
    },
    {
      hideInSearch: true,
      title: '学期',
      dataIndex: 'semester',
      valueType: 'text',
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
    // 在列定义中添加进度条
    {
      hideInSearch: true,
      title: '剩余容量',
      render: (_, record) => (
        <div>
          {/*@ts-ignore*/}
          <div>剩余: {record.maxCapacity - record.selected}</div>
          <Progress
            //@ts-ignore
            percent={((record.selected / record.maxCapacity) * 100).toFixed(2)}
            //@ts-ignore
            status={record.maxCapacity - record.selected > 0 ? 'active' : 'exception'}
          />
        </div>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <Button
          disabled={record.maxCapacity === record.selected}
          type={'primary'}
          onClick={() => handleSelect(record)}
        >
          {'选课'}
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Course>
        rowKey="id"
        columns={columns}
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
        search={{
          filterType: 'light',
          labelWidth: 100,
        }}
        toolbar={{
          title: '可选课程列表',
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />
    </PageContainer>
  );
};
