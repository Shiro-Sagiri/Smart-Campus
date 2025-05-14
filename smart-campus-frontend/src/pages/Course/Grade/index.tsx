import React, { useRef, useState } from 'react';
import { useParams } from '@umijs/max';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, message, Modal } from 'antd';
import {
  addGrade,
  listGradesByStudentIds,
  listStudentByPage,
} from '@/services/smart-campus/gradeController';

const Grade: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<API.UserVO>();
  const [gradeList, setGradeList] = useState<API.Grade[]>([]);

  // 新增成绩登记方法
  const handleGradeSubmit = async () => {
    try {
      const values = await form.validateFields();

      await addGrade({
        score: parseFloat(values.score),
        courseId: id,
        studentId: currentStudent?.userId,
      } as API.GradeAddRequest);

      message.success('成绩登记成功');
      setVisible(false);
      actionRef.current?.reload(); // 刷新表格数据
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const columns: ProColumns<API.UserVO>[] = [
    {
      title: '学号',
      dataIndex: 'userId',
      render: (dom) => {
        return <a onClick={() => {}}>{dom}</a>;
      },
      hideInSearch: true,
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      valueType: 'text',
      hideInSearch: true,
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
      title: '成绩',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        gradeList.find((item) => item.studentId === record.userId) === undefined ? (
          <Button
            key={'grade'}
            type={'primary'}
            onClick={() => {
              setCurrentStudent(record);
              setVisible(true);
            }}
          >
            登记成绩
          </Button>
        ) : (
          <>
            <div style={{ marginRight: 20 }}>
              {gradeList.find((item) => item.studentId === record.userId)?.score}
            </div>
            <Button
              key={'grade'}
              type={'primary'}
              onClick={() => {
                setCurrentStudent(record);
                setVisible(true);
              }}
            >
              修改成绩
            </Button>
          </>
        ),
      ],
    },
  ];
  return (
    <>
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
          const msg = await listStudentByPage(
            { id: id as any },
            {
              current: params.current,
              pageSize: params.pageSize,
            },
          );
          const res = await listGradesByStudentIds(
            {
              courseId: id as any,
            },
            msg.data?.records?.map((item) => item.userId) as any,
          );
          setGradeList(res.data || []);
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
        title={`成绩登记 - ${currentStudent?.userName}（${currentStudent?.userId}）`}
        open={visible}
        onOk={handleGradeSubmit}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical" initialValues={{ score: undefined }}>
          <Form.Item
            label="成绩"
            name="score"
            rules={[
              { required: true, message: '请输入成绩' },
              {
                pattern: /^(100|[1-9]?\d)$/,
                message: '请输入0-100之间的数字',
              },
            ]}
          >
            <Input placeholder="请输入0-100分之间的成绩" type="number" min={0} max={100} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Grade;
