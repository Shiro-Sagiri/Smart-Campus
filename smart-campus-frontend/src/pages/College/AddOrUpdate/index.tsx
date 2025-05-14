import { ProCard, ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-components';
import { Flex, message } from 'antd';
import { history } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from '@@/exports';
import { ProFormInstance } from '@ant-design/pro-components';
import {
  addCollege,
  getCollegeById,
  updateCollegeById,
} from '@/services/smart-campus/collegeController';

const AddOrUpdate: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  const [loading, setLoading] = useState(false);
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    const fetchCollegeData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const res = await getCollegeById({ id: id as string });
        formRef.current?.setFieldsValue({
          collegeId: res.data?.collegeId,
          collegeName: res.data?.collegeName,
          description: res.data?.description,
        });
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchCollegeData();
    }
  }, [id]);

  const addOrUpdateCollege = async (formData: API.CollegeAddRequest) => {
    try {
      if (!id) {
        await addCollege({
          ...formData,
          collegeId: formData.collegeId.padStart(2, '0'), // 自动补零至两位
        });
      } else {
        await updateCollegeById({ id: id as any }, formData);
      }
      const { from = '/college/list' } = (history.location.state as any) || {};
      history.push(from);
      message.success(`${id ? '编辑' : '添加'}成功！`);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <>
      <h2>{id ? '编辑学院' : '添加学院'}</h2>
      <ProCard>
        <Flex justify={'center'} align={'center'}>
          <ProForm<API.CollegeAddRequest>
            onFinish={addOrUpdateCollege}
            loading={loading}
            formRef={formRef}
          >
            <ProFormText
              width="lg"
              name="collegeId"
              required
              label="学院编号"
              disabled={!!id}
              placeholder="请输入学院编号"
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
              name="collegeName"
              required
              label="学院名称"
              placeholder="请输入学院名称"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormTextArea width="lg" name="description" label="简介" placeholder="请输入简介" />
          </ProForm>
        </Flex>
      </ProCard>
    </>
  );
};

export default AddOrUpdate;
