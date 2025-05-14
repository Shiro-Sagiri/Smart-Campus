import {
  addCourse,
  getCourseById,
  updateCourseById,
} from '@/services/smart-campus/courseController';
import { useParams } from '@@/exports';
import {
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormSegmented,
  ProFormText,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Flex, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { getTeacherList } from '@/services/smart-campus/userController';

const AddOrUpdate: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  const [loading, setLoading] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const [teacherList, setTeacherList] = useState<API.UserVO[]>([]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const res = await getTeacherList();
        setTeacherList(res.data as any);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData();
  }, []); // 空依赖数组表示仅执行一次

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
          hours: res.data?.hours,
          location: res.data?.location,
        });
        if (res.data?.schedule) {
          formRef.current?.setFieldsValue({
            weeks: res.data?.schedule.weeks,
            weekdays: res.data?.schedule.weekdays?.split(','),
            sections: res.data?.schedule.sections,
            remark: res.data?.schedule.remark,
            semester: res.data.semester,
          });
        }
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
    console.log(formData, 1241241);
    // 组合时间安排JSON
    const schedule: API.Schedule = {
      //@ts-ignore
      weeks: formData?.weeks,
      //@ts-ignore
      weekdays: formData?.weekdays.join(','),
      //@ts-ignore
      sections: formData?.sections,
      //@ts-ignore
      remark: formData?.remark || '',
    };
    try {
      if (!id) {
        await addCourse({
          ...formData,
          schedule,
        });
      } else {
        await updateCourseById({ id: id as any }, { ...formData, schedule });
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
            <ProFormSegmented
              name="semester"
              label="学期"
              required
              request={async () => {
                const year = new Date().getFullYear();
                return [
                  { label: `${year - 1}-${year}-1`, value: `${year - 1}-${year}-1` },
                  { label: `${year - 1}-${year}-2`, value: `${year - 1}-${year}-2` },
                  { label: `${year}-${year + 1}-1`, value: `${year}-${year + 1}-1` },
                  { label: `${year}-${year + 1}-2`, value: `${year}-${year + 1}-2` },
                ];
              }}
            />
            <ProFormDigit
              width="lg"
              name="credit"
              required
              label="学分"
              placeholder="请输入学分"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormDigit
              width="lg"
              name="hours"
              required
              label="学时"
              placeholder="请输入学时"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormSelect
              width="lg"
              name="teacherId" // 绑定字段名需与后端接口匹配
              label="教师"
              placeholder="请选择教师"
              rules={[{ required: true, message: '必须选择教师' }]}
              options={teacherList.map((teacher) => ({
                label: teacher.userName, // 显示名称
                value: teacher.userId, // 提交的值
              }))}
            />
            <ProFormDigit
              width="lg"
              name="maxCapacity"
              required
              label="最大选课人数"
              placeholder="请输入最大选课人数"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProForm.Group title="时间安排" extra="格式示例：1-16周 | 周一、周三 | 3-4节">
              <ProFormText name="weeks" label="周次范围" required placeholder="1-16" />
              <ProFormSelect
                name="weekdays"
                label="上课星期"
                width={300}
                mode="multiple"
                options={[
                  { label: '周一', value: '1' },
                  { label: '周二', value: '2' },
                  { label: '周三', value: '3' },
                  { label: '周四', value: '4' },
                  { label: '周五', value: '5' },
                  { label: '周六', value: '6' },
                  { label: '周日', value: '7' },
                ]}
                rules={[{ required: true }]}
              />
              <ProFormText
                name="sections"
                label="节次范围"
                required
                placeholder="3-4"
                rules={[{ pattern: /^\d+-\d+$/, message: '格式如: 3-4' }]}
              />
              <ProFormText name="remark" label="特殊说明" />
            </ProForm.Group>
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
