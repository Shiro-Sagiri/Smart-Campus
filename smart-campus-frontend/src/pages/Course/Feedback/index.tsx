import React, { useEffect, useState } from 'react';
import { Collapse, CollapseProps, Empty, List, message, Rate, Spin } from 'antd';
import { getCourseEvaluationList } from '@/services/smart-campus/courseController';
import dayjs from 'dayjs';
import { Pie } from '@ant-design/charts';

const FeedBack: React.FC = () => {
  const [feedback, setFeedback] = useState<CollapseProps['items']>();
  const [loading, setLoading] = useState(false);
  const [ratingData, setRatingData] = useState<RatingDistribution>([]);

  // 在组件顶部添加类型定义
  type RatingDistribution = { type: string; value: number; percent: string }[];

  // 统计评分分布的函数
  const calculateRatingDistribution = (data: any): RatingDistribution => {
    const ratingCount = Array(5).fill(0);

    Object.values(data).forEach((evaluations) => {
      //@ts-ignore
      evaluations.forEach(({ rating }) => {
        if (rating >= 1 && rating <= 5) {
          ratingCount[rating - 1] += 1;
        }
      });
    });

    const total = ratingCount.reduce((sum, val) => sum + val, 0);
    return ratingCount.map((count, index) => ({
      type: `${index + 1}星`,
      value: count,
      percent: total > 0 ? `${((count / total) * 100).toFixed(1)}%` : '0%',
    }));
  };

  useEffect(() => {
    const getFeedbackList = async () => {
      setLoading(true);
      try {
        const res = await getCourseEvaluationList();
        if (res.code === 0) {
          // 转换数据结构
          //@ts-ignore
          const collapseItems = Object.entries(res.data).map(([courseName, evaluations]) => ({
            key: courseName,
            label: courseName,
            children: (
              <List
                dataSource={evaluations}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      //@ts-ignore
                      title={<Rate disabled defaultValue={item.rating} />}
                      description={
                        <>
                          {/*@ts-ignore*/}
                          <div>{item.comment}</div>
                          <div style={{ color: '#999', marginTop: 8 }}>
                            {/*@ts-ignore*/}
                            {dayjs(item.submitTime).format('YYYY-MM-DD HH:mm')}
                          </div>
                        </>
                      }
                    />
                  </List.Item>
                )}
                locale={{ emptyText: '暂无评价' }}
              />
            ),
          }));
          setFeedback(collapseItems);
          setRatingData(calculateRatingDistribution(res.data));
        }
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getFeedbackList();
  }, []);

  const RatingPieChart = ({ data }: { data: RatingDistribution }) => {
    const config = {
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.75,
      innerRadius: 0.4,
      label: {
        type: 'outer',
        content: '{name} {percentage}',
        style: {
          fontSize: 14,
          fill: '#666',
        },
      },
      legend: {
        position: 'bottom',
        itemName: {
          style: {
            fill: '#333',
            fontSize: 12,
          },
        },
      },
      color: ['#ff4d4f', '#ff7a45', '#ffa940', '#ffc53d', '#73d13d'], // 红到绿渐变
      tooltip: {
        formatter: (datum: any) => ({
          name: datum.type,
          value: `${datum.value}次 (${datum.percent})`,
        }),
      },
      interactions: [{ type: 'element-active' }],
    };

    return <Pie {...config} style={{ height: 400, marginTop: 24 }} />;
  };

  return (
    <>
      <h2>课程反馈统计</h2>
      <Spin spinning={loading}>
        <Collapse size="large" accordion items={feedback} expandIconPosition="end" />
        <div style={{ marginTop: 40 }}>
          <h3>评分分布统计</h3>
          {ratingData.some((item) => item.value > 0) ? (
            <RatingPieChart data={ratingData} />
          ) : (
            <Empty description="暂无评分数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      </Spin>
    </>
  );
};

export default FeedBack;
