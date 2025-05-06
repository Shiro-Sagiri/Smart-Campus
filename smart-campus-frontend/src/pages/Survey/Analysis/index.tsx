import { Pie, Bar } from '@ant-design/charts';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Alert, message, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import {
  getSurveyAnswer,
  getSurveyVoById,
  getTextAnswer,
} from '@/services/smart-campus/surveyController';

export default () => {
  const { id: surveyId } = useParams();
  const currentTime = dayjs();
  const [surveyData, setSurveyData] = useState<API.SurveyVO>();
  const [surveyAnswerData, setSurveyAnswerData] = useState<API.SurveyAnswer[]>();

  // 获取问卷数据
  useEffect(() => {
    const getSurveyData = async () => {
      try {
        const response = await getSurveyVoById({ id: surveyId as string });
        const res = await getSurveyAnswer({ surveyId: surveyId as any });
        setSurveyAnswerData(res.data as API.SurveyAnswer[]);
        setSurveyData(response.data);
      } catch (error: any) {
        message.error(error);
      }
    };
    getSurveyData();
  }, []);

  // 可视化配置
  const pieConfig = (data: any[]) => ({
    data,
    angleField: 'count',
    colorField: 'option',
    radius: 0.8,
  });

  const barConfig = (data: any[]) => ({
    data,
    isStack: true,
    xField: 'option',
    yField: 'count',
    seriesField: 'type',
    label: {
      position: 'middle',
      content: (item: any) => `${item.count}次`,
      style: { fill: '#fff' },
    },
  });

  return (
    <div style={{ padding: 24 }}>
      {/* 问卷概览 */}
      <ProCard
        title={surveyData?.title}
        extra={
          <Tag color={currentTime.isAfter(surveyData?.endTime) ? 'red' : 'green'}>
            {currentTime.isAfter(surveyData?.endTime) ? '已结束' : '进行中'}
          </Tag>
        }
      >
        <Alert
          message={`截止时间：${dayjs(surveyData?.endTime).format('YYYY-MM-DD HH:mm')}`}
          type="info"
        />
      </ProCard>

      {/* 逐题分析 */}
      {surveyData?.questionList?.map((question: API.SurveyQuestion) => {
        const questionAnswer = surveyAnswerData?.filter(
          (item) => item.questionId === question.questionId,
        );
        if (question.type === 'RADIO') {
          const answer = questionAnswer?.filter((item) => item.type === 'RADIO');
          const options = question.options?.map((opt) => ({
            option: opt,
            count: answer?.filter((item) => item.answer === opt).length,
          }));
          return (
            <ProCard
              key={question.questionId}
              title={`${question.content}`}
              style={{ marginTop: 24 }}
            >
              <Pie {...pieConfig(options as any)} />
            </ProCard>
          );
        } else if (question.type === 'MULTIPLE') {
          const answer = questionAnswer?.filter((item) => item.type === 'MULTIPLE');
          const options = question.options?.map((opt) => {
            const countMap = answer?.reduce((acc, curr) => {
              const options: string[] = JSON.parse(curr.answer as string);
              options.forEach((option) => {
                acc[option] = (acc[option] || 0) + 1;
              });
              return acc;
            }, {} as Record<string, number>);
            return {
              option: opt,
              type: '选择次数',
              count: countMap?.[opt] || 0,
            };
          });
          return (
            <ProCard
              key={question.questionId}
              title={`${question.content}`}
              style={{ marginTop: 24 }}
            >
              <Bar {...barConfig(options as any)} />
            </ProCard>
          );
        }
        return (
          <ProCard
            key={question.questionId}
            title={`${question.content}`}
            style={{ marginTop: 24 }}
          >
            {/* 文本答案分页展示 */}
            {question.type === 'TEXT' && (
              <ProTable<API.SurveyQuestion>
                request={async (params) => {
                  const res = await getTextAnswer({ surveyId: surveyId as any }, params);
                  return {
                    data: res.data?.records,
                    total: res.data?.total,
                    success: true,
                  };
                }}
                columns={[
                  { title: '用户ID', dataIndex: 'userId', width: 120 },
                  { title: '回答内容', dataIndex: 'answer', ellipsis: true },
                  {
                    title: '提交时间',
                    dataIndex: 'submitTime',
                    render: (t) => dayjs(t as any).format('YYYY-MM-DD HH:mm'),
                  },
                ]}
                pagination={{
                  pageSizeOptions: [10, 20, 50],
                  showQuickJumper: true,
                }}
                search={false}
              />
            )}
          </ProCard>
        );
      })}
    </div>
  );
};
