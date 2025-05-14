import { ProCard, ProForm, ProFormDatePicker, ProFormSelect } from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-components';
import { Flex, message } from 'antd';
import { history } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from '@@/exports';
import { ProFormInstance } from '@ant-design/pro-components';
import { addClass, getClassById, updateClassById } from '@/services/smart-campus/classController';
import { listMajor } from '@/services/smart-campus/majorController';
import { getTeacherList } from '@/services/smart-campus/userController';

const AddOrUpdate: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  const [loading, setLoading] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const [majorList, setMajorList] = useState<API.Major[]>([]);
  const [teacherList, setTeacherList] = useState<API.UserVO[]>([]);

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

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const res = await getClassById({ id: id as string });
        formRef.current?.setFieldsValue({
          classId: res.data?.classId,
          majorId: res.data?.majorId,
          headTeacherId: res.data?.headTeacherId,
          studentCount: res.data?.studentCount,
          admissionYear: res.data?.admissionYear,
        });
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchClassData();
    }
  }, [id]);

  const addOrUpdateClass = async (formData: API.ClassAddRequest) => {
    // 获取年份后两位
    const yearSuffix = formData.admissionYear.slice(-2);
    // 获取班级编号并补零
    const classCode = formData.classId.padStart(2, '0');
    // 组合完整编号
    const fullClassId = `${yearSuffix}${formData.majorId}${classCode}`;
    try {
      if (!id) {
        await addClass({
          ...formData,
          classId: fullClassId,
        });
      } else {
        await updateClassById({ id: id as any }, formData);
      }
      const { from = '/class/list' } = (history.location.state as any) || {};
      history.push(from);
      message.success(`${id ? '编辑' : '添加'}成功！`);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <>
      <h2>{id ? '编辑班级' : '添加班级'}</h2>
      <ProCard>
        <Flex justify={'center'} align={'center'}>
          <ProForm<API.ClassAddRequest>
            onFinish={addOrUpdateClass}
            loading={loading}
            formRef={formRef}
          >
            <ProFormText
              width="lg"
              name="classId"
              required
              label="班级编号"
              disabled={!!id}
              placeholder="请输入班级编号"
              rules={[
                { required: true, message: '这是必填项' },
                {
                  pattern: /^[0-9]{1,2}$/,
                  message: '只能输入1-2位数字',
                },
              ]}
            />
            <ProFormSelect
              width="lg"
              name="majorId" // 绑定字段名需与后端接口匹配
              label="所属专业"
              placeholder="请选择专业"
              rules={[{ required: true, message: '必须选择所属专业' }]}
              options={majorList.map((major) => ({
                label: major.majorName, // 显示名称
                value: major.majorId, // 提交的值
              }))}
            />
            <ProFormSelect
              width="lg"
              name="headTeacherId" // 绑定字段名需与后端接口匹配
              label="班主任"
              placeholder="请选择班主任"
              rules={[{ required: true, message: '必须选择班主任' }]}
              options={teacherList.map((teacher) => ({
                label: teacher.userName, // 显示名称
                value: teacher.userId, // 提交的值
              }))}
            />
            <ProFormDatePicker
              width="lg"
              name="admissionYear"
              label="入学年份"
              placeholder="请选择年份"
              rules={[{ required: true, message: '必须选择入学年份' }]}
              fieldProps={{
                picker: 'year',
                format: 'YYYY',
                valueFormat: 'YYYY',
              }}
            />
          </ProForm>
        </Flex>
      </ProCard>
    </>
  );
};

export default AddOrUpdate;
