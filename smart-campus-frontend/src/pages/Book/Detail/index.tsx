import { PageContainer } from '@ant-design/pro-components';
import { useParams, history } from '@umijs/max';
import styles from './index.less';
import {
  Button,
  Card,
  Descriptions,
  Skeleton,
  message,
  Modal,
  Tag,
  Avatar,
  Form,
  DatePicker,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { borrowBook, getBookById } from '@/services/smart-campus/bookController';
import { BookOutlined } from '@ant-design/icons';
import moment from 'moment';
import dayjs from 'dayjs';

const BookDetailPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [bookData, setBookData] = useState<API.Book>();
  const [loading, setLoading] = useState(true);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取图书详情
  const fetchData = async () => {
    try {
      const response = await getBookById({ id: bookId! });
      setBookData(response.data);
    } catch (error) {
      message.error('获取图书详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bookId]);

  // 借阅状态标签
  const borrowStatusTag =
    //@ts-ignore
    bookData?.total > bookData?.borrowedNum ? (
      //@ts-ignore
      <Tag color="green">可借阅（剩余 {bookData?.total - bookData?.borrowedNum} 本）</Tag>
    ) : (
      <Tag color="red">已借完</Tag>
    );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await borrowBook({
        id: bookId as any,
        dueTime: dayjs(values.returnDate).format('YYYY-MM-DD'),
      });
      setVisible(false);
      message.success('借阅成功');
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setBorrowLoading(false);
    }
  };

  return (
    <PageContainer title="图书详情" onBack={() => history.back()}>
      <Modal
        title="确认借阅"
        open={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        okText="确认借阅"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="选择归还日期"
            name="returnDate"
            rules={[
              {
                required: true,
                message: '请选择归还日期',
              },
              {
                validator: (_, value) => {
                  if (value && value < moment().add(1, 'day')) {
                    return Promise.reject('归还日期不能早于明天');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
      <Card style={{ margin: 16 }}>
        <Skeleton loading={loading} active>
          <Descriptions
            className={`${styles.bookDetailPage} ${styles.compactVerticalSpace}`}
            title={<span style={{ fontSize: 20 }}>{bookData?.title}</span>}
            column={2}
          >
            <Descriptions.Item label="封面">
              <Avatar
                shape="square"
                src={bookData?.cover}
                size={200}
                icon={<BookOutlined />}
                style={{ width: 200, height: 280, objectFit: 'cover' }}
              />
            </Descriptions.Item>

            <Descriptions.Item className="author-section" label="作者">
              {bookData?.author}
            </Descriptions.Item>
            <Descriptions.Item label="出版社">{bookData?.publisherName}</Descriptions.Item>
            <Descriptions.Item label="出版日期">{bookData?.publishDate}</Descriptions.Item>
            <Descriptions.Item label="馆藏总量">{bookData?.total}</Descriptions.Item>
            <Descriptions.Item label="当前借出">{bookData?.borrowedNum}</Descriptions.Item>
            <Descriptions.Item label="借阅状态">{borrowStatusTag}</Descriptions.Item>

            <Descriptions.Item label="简介" span={2}>
              <div
                style={{
                  padding: 16,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 4,
                  minHeight: 100,
                }}
              >
                {bookData?.description || '暂无简介'}
              </div>
            </Descriptions.Item>
          </Descriptions>

          <div
            style={{
              marginTop: 32,
              display: 'flex',
              gap: 16,
              justifyContent: 'flex-end',
              borderTop: '1px solid #f0f0f0',
              paddingTop: 24,
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
                setBorrowLoading(true);
              }}
              loading={borrowLoading}
              //@ts-ignore
              disabled={bookData?.total <= bookData?.borrowedNum}
            >
              立即借阅
            </Button>
            <Button onClick={() => history.back()}>返回列表</Button>
          </div>
        </Skeleton>
      </Card>
    </PageContainer>
  );
};

export default BookDetailPage;
