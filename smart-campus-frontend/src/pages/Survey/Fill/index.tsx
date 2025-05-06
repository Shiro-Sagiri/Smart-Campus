import React, { useEffect, useState } from 'react';
import { useParams } from '@@/exports';
import { getSurveyVoById, submitSurveyAnswer } from '@/services/smart-campus/surveyController';
import { Alert, Checkbox, Form, Input, message, Radio, Spin, Typography } from 'antd';
import { ProCard, ProForm } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { history } from '@umijs/max';

const Fill: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [surveyData, setSurveyData] = useState<API.SurveyVO>();

  // 题型匹配器（参考网页5动态渲染思想）
  const renderQuestionType = (question: API.SurveyQuestion) => {
    switch (question.type) {
      case 'RADIO':
        return <Radio.Group options={question.options} />;
      case 'MULTIPLE':
        return <Checkbox.Group options={question.options} />;
      case 'TEXT':
        return <Input.TextArea rows={4} placeholder="请输入..." />;
      default:
        return <Alert message="未知题型" type="error" />;
    }
  };

  // 动态渲染题目组件
  const renderQuestions = () => {
    return surveyData?.questionList?.map((question, index) => (
      <ProForm.Item
        key={question.questionId}
        label={`${index + 1}. ${question.content}`}
        name={question.questionId}
        rules={[{ required: true, message: '此项为必填项' }]}
      >
        {renderQuestionType(question)}
      </ProForm.Item>
    ));
  };

  // 提交数据转换（适配接口格式）
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    const answers = Object.entries(values).map(([questionId, value]) => ({
      questionId: parseInt(questionId),
      answer: Array.isArray(value) ? JSON.stringify(value) : value,
      type: surveyData?.questionList?.find((q) => q.questionId === parseInt(questionId))?.type,
    }));
    try {
      await submitSurveyAnswer({ surveyId: id as any }, answers as any);
      message.success('提交成功！');
      history.push('/welcome');
    } finally {
      setSubmitting(false);
    }
  };

  // 获取问卷数据
  useEffect(() => {
    const getSurveyData = async () => {
      try {
        const response = await getSurveyVoById({ id: id as string });
        setSurveyData(response.data);
      } catch (error: any) {
        message.error(error);
      } finally {
        setLoading(false);
      }
    };
    getSurveyData();
  }, []);

  return (
    <ProCard title={surveyData?.title}>
      <Spin spinning={loading}>
        {/* 问卷基础信息 */}
        <div style={{ marginBottom: 24 }}>
          <p>{surveyData?.description}</p>
          <Typography.Text type="secondary">
            有效时间：{dayjs(surveyData?.startTime).format('YYYY-MM-DD HH:mm')} ~
            {dayjs(surveyData?.endTime).format('YYYY-MM-DD HH:mm')}
          </Typography.Text>
        </div>
        {/* 动态表单区域 */}
        <ProForm
          form={form}
          onFinish={handleSubmit}
          submitter={{
            submitButtonProps: {
              loading: submitting,
            },
          }}
        >
          {renderQuestions()}
        </ProForm>
      </Spin>
    </ProCard>
  );
};

export default Fill;
