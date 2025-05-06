import { GridContent, ProCard, ProList } from '@ant-design/pro-components';
import { Link, useModel } from '@umijs/max';
import { Avatar, Card, Flex, List, Space, Tag, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  ClockCircleOutlined,
  HistoryOutlined,
  NotificationFilled,
  PlayCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { listUserSurveyByPage } from '@/services/smart-campus/surveyController';
import { listAnnouncementByPage } from '@/services/smart-campus/announcementController';
import dayjs from 'dayjs';

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [announcements, setAnnouncements] = useState<API.Announcement[]>([]);
  const [announcementsTotal, setAnnouncementsTotal] = useState(0);

  // 初始化加载
  useEffect(() => {
    const loadInitialData = async () => {
      const announceRes = await listAnnouncementByPage({
        current: 1,
        pageSize: 5,
        target: (currentUser?.role as any) === 'ADMIN' ? 'ALL' : (currentUser?.role as any),
      });
      setAnnouncements(announceRes.data?.records as API.Announcement[]);
      setAnnouncementsTotal(announceRes.data?.total as number);
    };
    loadInitialData();
  }, []);

  return (
    <GridContent>
      <Card style={{ marginBottom: 24 }}>
        <Space size="middle">
          {/* 用户头像 - 网页6头像上传方案 */}
          <Avatar
            src={currentUser?.userAvatar}
            size={64}
            icon={<UserOutlined />}
            style={{
              backgroundColor: '#1890ff',
              cursor: 'pointer',
            }}
          />
          {/* 欢迎语区域 - 网页7标题组合方案 */}
          <div>
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              欢迎回来，{currentUser?.userName} ，祝你开心每一天！
            </Typography.Title>
          </div>
        </Space>
      </Card>
      {/* 公告列表 */}
      <Card title="最新公告" style={{ marginBottom: 24 }}>
        <List
          pagination={{
            pageSize: 5,
            total: announcementsTotal,
            onChange: async (page, pageSize) => {
              const res = await listAnnouncementByPage({
                current: page,
                pageSize,
                target: currentUser?.role as any,
              });
              setAnnouncements(res.data?.records as API.Announcement[]);
              setAnnouncementsTotal(res.data?.total as number);
            },
            showSizeChanger: false,
            position: 'bottom',
          }}
          dataSource={announcements}
          renderItem={(announceItem) => (
            <List.Item>
              <List.Item.Meta
                avatar={<NotificationFilled style={{ fontSize: 24 }} />}
                title={<a>{announceItem.title}</a>}
                description={
                  <>
                    <div>{announceItem.content}</div>
                    <div style={{ marginTop: 8, color: '#888' }}>{announceItem.publishTime}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>
      {/* 进行中的问卷 */}
      <ProList
        headerTitle="待填问卷"
        rowKey="surveyId"
        request={async (params = { current: 1, pageSize: 4 }) => {
          // 每页4项，按两列布局
          const response = await listUserSurveyByPage({
            current: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: response.data?.records,
            total: response.data?.total,
            success: true,
          };
        }}
        pagination={{
          pageSize: 4,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 份问卷`,
          style: { paddingRight: 24 }, // 对齐右侧边距
          pageSizeOptions: [4, 8, 12], // 可选分页大小
          responsive: true, // 响应式布局
        }}
        renderItem={(item) => {
          // 时间判断逻辑（使用dayjs库）
          const currentTime = dayjs();
          const isNotStarted = currentTime.isBefore(dayjs(item.startTime)); // 当前时间早于开始时间[1](@ref)
          const isExpired = currentTime.isAfter(dayjs(item.endTime)); // 当前时间晚于截止时间[6](@ref)
          const isActive = !isNotStarted && !isExpired; // 进行中状态
          // @ts-ignore
          return (
            <ProCard
              hoverable
              style={{ marginBottom: 5 }}
              actions={[
                // 条件渲染按钮[4](@ref)
                ...(isExpired || isNotStarted
                  ? []
                  : [
                      <Link key="fill" to={`/survey/fill/${item.surveyId}`}>
                        立即填写
                      </Link>,
                    ]),
              ]}
            >
              <Card.Meta
                title={
                  <Flex justify="space-between">
                    <h2 style={{ marginRight: 30 }}>{item.title}</h2>
                    {isExpired && (
                      <Tooltip title="该问卷已超过截止时间">
                        <Tag style={{ height: 23 }} color="red" icon={<ClockCircleOutlined />}>
                          已过期
                        </Tag>
                      </Tooltip>
                    )}
                    {isNotStarted && (
                      <Tooltip title="该问卷即将开始">
                        <Tag style={{ height: 23 }} color="blue" icon={<HistoryOutlined />}>
                          即将开始
                        </Tag>
                      </Tooltip>
                    )}
                    {isActive && (
                      <Tooltip title="该问卷进行中">
                        <Tag style={{ height: 23 }} color="green" icon={<PlayCircleOutlined />}>
                          进行中
                        </Tag>
                      </Tooltip>
                    )}
                  </Flex>
                }
                description={
                  <>
                    {isNotStarted && (
                      <div style={{ color: '#bfbfbf' }}>
                        开始时间：{dayjs(item.startTime).format('YYYY-MM-DD HH:mm')}
                      </div>
                    )}
                    <div style={{ color: '#bfbfbf' }}>
                      截止时间：{dayjs(item.endTime).format('YYYY-MM-DD HH:mm')}
                    </div>
                  </>
                }
              />
            </ProCard>
          );
        }}
      />
    </GridContent>
  );
};

export default Welcome;
