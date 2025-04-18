import { ProCard, ProForm, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-components';
import { Flex, message } from 'antd';
import { history } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from '@@/exports';
import { ProFormInstance } from '@ant-design/pro-components';
import {
  addAnnouncement,
  getAnnouncementById,
  updateAnnouncementById,
} from '@/services/smart-campus/announcementController';

const AddOrUpdate: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  const [loading, setLoading] = useState(false);
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    const fetchAnnouncementData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const res = await getAnnouncementById({ id: id as string });
        formRef.current?.setFieldsValue({
          title: res.data?.title,
          target: res.data?.target,
          content: res.data?.content,
        });
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchAnnouncementData();
    }
  }, [id]);

  const addOrUpdateAnnouncement = async (formData: API.AnnouncementAddRequest) => {
    try {
      if (!id) {
        await addAnnouncement(formData);
      } else {
        await updateAnnouncementById({ id: id as any }, formData);
      }
      const { from = '/announcement/list' } = (history.location.state as any) || {};
      history.push(from);
      message.success(`${id ? '编辑' : '添加'}成功！`);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <>
      <h2>{id ? '编辑图书' : '添加图书'}</h2>
      <ProCard>
        <Flex justify={'center'} align={'center'}>
          <ProForm<API.AnnouncementAddRequest>
            onFinish={addOrUpdateAnnouncement}
            loading={loading}
            formRef={formRef}
          >
            <ProFormText
              width="lg"
              name="title"
              required
              label="标题"
              placeholder="请输入标题"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormTextArea
              width="lg"
              name="content"
              required
              label="内容"
              placeholder="请输入内容"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormSelect
              width="lg"
              name="target"
              required
              label="目标"
              placeholder="请选择目标"
              rules={[{ required: true, message: '这是必选项' }]}
              options={[
                { value: 'ALL', label: '全体' },
                { value: 'TEACHER', label: '职工' },
                { value: 'STUDENT', label: '学生' },
              ]}
            />
          </ProForm>
        </Flex>
      </ProCard>
    </>
  );
};

export default AddOrUpdate;
