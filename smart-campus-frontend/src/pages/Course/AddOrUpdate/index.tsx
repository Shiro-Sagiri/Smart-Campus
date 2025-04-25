import {
  addCourse,
  getCourseById,
  updateCourseById,
} from '@/services/smart-campus/courseController';
import { useParams } from '@@/exports';
import {
  ProCard,
  ProForm, ProFormDigit,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Flex, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const AddOrUpdate: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  const [loading, setLoading] = useState(false);
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const res = await getCourseById({ id: id as string });
        formRef.current?.setFieldsValue({
          courseName: res.data?.courseName,
          credit: res.data?.credit,
          teacherId: res.data?.teacherId,
          maxCapacity: res.data?.maxCapacity,
          classTime: res.data?.classTime,
          location: res.data?.location,
        });
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const addOrUpdateCourse = async (formData: API.CourseAddRequest) => {
    try {
      if (!id) {
        await addCourse(formData);
      } else {
        await updateCourseById({ id: id as any }, formData);
      }
      const { from = '/course/list' } = (history.location.state as any) || {};
      history.push(from);
      message.success(`${id ? '编辑' : '添加'}成功！`);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <>
      <h2>{id ? '编辑课程' : '添加课程'}</h2>
      <ProCard>
        <Flex justify={'center'} align={'center'}>
          <ProForm<API.CourseAddRequest>
            onFinish={addOrUpdateCourse}
            loading={loading}
            formRef={formRef}
          >
            <ProFormText
              width="lg"
              name="courseName"
              required
              label="课程名称"
              placeholder="请输入课程名称"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormDigit
              width="lg"
              name="credit"
              required
              label="学分"
              placeholder="请输入学分"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormText
              width="lg"
              name="teacherId"
              required
              label="教师工号"
              placeholder="请输入教师工号"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormDigit
              width="lg"
              name="maxCapacity"
              required
              label="最大选课人数"
              placeholder="请输入最大选课人数"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormText
              width="lg"
              name="classTime"
              required
              label="上课时间"
              placeholder="请输入上课时间"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormText
              width="lg"
              name="location"
              required
              label="上课地点"
              placeholder="请输入上课地点"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ProForm>
        </Flex>
      </ProCard>
    </>
  );
};

export default AddOrUpdate;
