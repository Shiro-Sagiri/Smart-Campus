import {
  addSurvey,
  getSurveyVoById,
  updateSurveyById,
} from '@/services/smart-campus/surveyController';
import { useParams } from '@@/exports';
import {
  ProCard,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Flex, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const AddOrUpdate: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  const [loading, setLoading] = useState(false);
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const res = await getSurveyVoById({ id: id as string });
        formRef.current?.setFieldsValue({
          title: res.data?.title,
          description: res.data?.description,
          startTime: res.data?.startTime,
          endTime: res.data?.endTime,
        });
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchSurveyData();
    }
  }, [id]);

  const addOrUpdateSurvey = async (formData: API.SurveyAddRequest) => {
    try {
      if (!id) {
        await addSurvey(formData);
        console.log(formData);
      } else {
        await updateSurveyById({ id: id as any }, formData);
      }
      const { from = '/survey/list' } = (history.location.state as any) || {};
      history.push(from);
      message.success(`${id ? '编辑' : '添加'}成功！`);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <>
      <h2>{id ? '编辑问卷' : '添加问卷'}</h2>
      <ProCard>
        <Flex justify={'center'} align={'center'}>
          <ProForm<API.SurveyAddRequest>
            onFinish={addOrUpdateSurvey}
            loading={loading}
            formRef={formRef}
          >
            <ProFormText
              width="lg"
              name="title"
              required
              label="问卷标题"
              placeholder="请输入问卷标题"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormTextArea
              width="lg"
              name="description"
              required
              label="描述"
              placeholder="请输入描述"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormDateTimeRangePicker
              label="时间范围"
              name="time"
              transform={(value) => ({
                startTime: value?.[0],
                endTime: value?.[1],
              })}
              required
              rules={[{ required: true, message: '这是必选项' }]}
            />
          </ProForm>
        </Flex>
      </ProCard>
    </>
  );
};

export default AddOrUpdate;
