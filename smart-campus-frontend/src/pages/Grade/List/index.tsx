import React, { useEffect, useRef, useState } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Card, Flex, Form, message, Modal, Rate, Tag } from 'antd';
import { getGpa, listGrades } from '@/services/smart-campus/gradeController';
import TextArea from 'antd/es/input/TextArea';
import { evaluateCourse } from '@/services/smart-campus/courseController';

const Grade: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<API.GradeVO>();
  const [rankVO, setRankVO] = useState<API.RankVO>();

  useEffect(() => {
    const getStudentGPA = async () => {
      try {
        const res = await getGpa();
        setRankVO(res.data);
      } catch (error: any) {
        message.error(error.message);
      }
    };
    getStudentGPA();
  }, []);

  // 新增成绩登记方法
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await evaluateCourse({
        ...values,
        courseId: currentCourse?.courseId,
      });
      setVisible(false);
      actionRef.current?.reload();
      message.success('课程评价成功');
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns: ProColumns<API.GradeVO>[] = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      render: (dom) => {
        return <a onClick={() => {}}>{dom}</a>;
      },
      hideInSearch: true,
    },
    {
      title: '学期',
      dataIndex: 'semester',
      valueType: 'text',
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
      title: '成绩',
      dataIndex: 'score',
      valueType: 'digit',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        record.isComment ? (
          <Tag>已评价</Tag>
        ) : (
          <Button
            key={'comment'}
            type={'primary'}
            onClick={() => {
              setVisible(true);
              setCurrentCourse(record);
            }}
          >
            课程评价
          </Button>
        ),
      ],
    },
  ];
  return (
    <>
      <Card style={{ marginBottom: 24 }}>
        <Flex align={'center'} justify={'space-between'}>
          <span>
            修读总学分:
            <Tag style={{ marginLeft: 13 }} color={'red'}>
              {rankVO?.totalCredit}
            </Tag>
          </span>
          <span>
            获得学分:
            <Tag style={{ marginLeft: 13 }} color={'red'}>
              {rankVO?.requiredCredit}
            </Tag>
          </span>
          <span>
            不及格学分:
            <Tag style={{ marginLeft: 13 }} color={'red'}>
              {rankVO?.failCredit}
            </Tag>
          </span>
          <span>
            课程门数:
            <Tag style={{ marginLeft: 13 }} color={'red'}>
              {rankVO?.totalCourse}
            </Tag>
          </span>
          <span>
            我的GPA:
            <Tag style={{ marginLeft: 13 }} color={'red'}>
              {rankVO?.gpa}
            </Tag>
          </span>
          <span>
            专业排名:
            <Tag style={{ marginLeft: 13 }} color={'red'}>
              {rankVO?.majorRank}
            </Tag>
          </span>
          <span>
            班级排名:
            <Tag style={{ marginLeft: 13 }} color={'red'}>
              {rankVO?.classRank}
            </Tag>
          </span>
        </Flex>
      </Card>
      <ProTable<API.GradeVO, API.GradeQueryRequest>
        // params 是需要自带的参数
        // 这个参数优先级更高，会覆盖查询表单的参数
        // params={params}
        actionRef={actionRef}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params: API.GradeQueryRequest,
        ) => {
          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const msg = await listGrades({
            current: params.current,
            pageSize: params.pageSize,
            semester: params.semester,
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
        search={false}
      />
      <Modal
        title={`课程评价`}
        open={visible}
        onOk={handleSubmit}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={{ score: undefined }}>
          <Form.Item label="评分" name="rating">
            <Rate />
          </Form.Item>
          <Form.Item label="评价" name="comment">
            <TextArea rows={4} placeholder="请输入课程的评价" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Grade;
