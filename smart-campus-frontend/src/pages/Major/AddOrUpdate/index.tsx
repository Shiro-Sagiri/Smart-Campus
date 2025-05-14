import { ProCard, ProForm, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-components';
import { Flex, message } from 'antd';
import { history } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from '@@/exports';
import { ProFormInstance } from '@ant-design/pro-components';
import { addMajor, getMajorById, updateMajorById } from '@/services/smart-campus/majorController';
import { listCollege } from '@/services/smart-campus/collegeController';

const AddOrUpdate: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  const [loading, setLoading] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const [collegeList, setCollegeList] = useState<API.College[]>([]);

  useEffect(() => {
    const fetchCollegeData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const response = await listCollege();
        setCollegeList(response.data as any);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCollegeData();
  }, []); // 空依赖数组表示仅执行一次

  useEffect(() => {
    const fetchMajorData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const res = await getMajorById({ id: id as string });
        formRef.current?.setFieldsValue({
          majorId: res.data?.majorId,
          collegeId: res.data?.collegeId,
          majorName: res.data?.majorName,
          description: res.data?.description,
        });
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchMajorData();
    }
  }, [id]);

  const addOrUpdateMajor = async (formData: API.MajorAddRequest) => {
    // 获取专业编号并补零
    const majorCode = formData.majorId.padStart(2, '0');
    // 组合完整编号
    const fullMajorId = `${formData.collegeId}${majorCode}`;
    try {
      if (!id) {
        await addMajor({
          ...formData,
          majorId: fullMajorId,
        });
      } else {
        await updateMajorById({ id: id as any }, formData);
      }
      const { from = '/major/list' } = (history.location.state as any) || {};
      history.push(from);
      message.success(`${id ? '编辑' : '添加'}成功！`);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <>
      <h2>{id ? '编辑专业' : '添加专业'}</h2>
      <ProCard>
        <Flex justify={'center'} align={'center'}>
          <ProForm<API.MajorAddRequest>
            onFinish={addOrUpdateMajor}
            loading={loading}
            formRef={formRef}
          >
            <ProFormText
              width="lg"
              name="majorId"
              required
              label="专业编号"
              disabled={!!id}
              placeholder="请输入专业编号"
              rules={[
                { required: true, message: '这是必填项' },
                {
                  pattern: /^[0-9]{1,2}$/,
                  message: '只能输入1-2位数字',
                },
              ]}
            />
            <ProFormText
              width="lg"
              name="majorName"
              required
              label="专业名称"
              placeholder="请输入专业名称"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormSelect
              width="lg"
              name="collegeId" // 绑定字段名需与后端接口匹配
              label="所属学院"
              placeholder="请选择学院"
              rules={[{ required: true, message: '必须选择所属学院' }]}
              options={collegeList.map((college) => ({
                label: college.collegeName, // 显示名称
                value: college.collegeId, // 提交的值
              }))}
            />
            <ProFormTextArea width="lg" name="description" label="简介" placeholder="请输入简介" />
          </ProForm>
        </Flex>
      </ProCard>
    </>
  );
};

export default AddOrUpdate;
