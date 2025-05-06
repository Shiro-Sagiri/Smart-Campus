import { ProList } from '@ant-design/pro-components';
import { Avatar, Col, Row, Tag, Typography, Input } from 'antd';
import { listBookByPage } from '@/services/smart-campus/bookController';
import { history } from '@umijs/max';
import { BookOutlined } from '@ant-design/icons';
import React from 'react';

const BookList = () => {
  const { Search } = Input;
  return (
    <>
      <Search size={"large"} style={{marginBottom: 40}} placeholder="通过书名或作者检索" loading={false} enterButton />
      <ProList<API.Book>
        rowKey="bookId"
        onRow={(record) => ({
          onClick: () => history.push(`/book/detail/${record.bookId}`),
        })}
        headerTitle="图书列表"
        request={async (params) => {
          const response = await listBookByPage({
            ...params,
            current: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: response.data?.records,
            total: response.data?.total,
            success: true,
          };
        }}
        metas={{
          title: {
            dataIndex: 'title',
            render: (_, record) => (
              <a style={{ fontSize: 24 }} onClick={() => history.push(`/books/${record.bookId}`)}>
                {record.title}
              </a>
            ),
          },
          avatar: {
            dataIndex: 'cover',
            render: (_, record) => (
              <Avatar
                shape="square"
                src={record.cover}
                size={200}
                icon={<BookOutlined />}
                style={{ width: 160, marginRight: 30, marginLeft: 30 }}
              />
            ),
          },
          description: {
            dataIndex: 'description',
            render: (_, record) => (
              <Row gutter={[16, 24]}>
                <Col className="gutter-row" span={24}>
                  <Typography.Paragraph>{record.description}</Typography.Paragraph>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Typography.Text style={{ fontSize: 18 }}>
                    出版社：{record.publisherName}
                  </Typography.Text>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Typography.Text style={{ fontSize: 18 }}>
                    出版日期：{record.publishDate}
                  </Typography.Text>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Typography.Text style={{ fontSize: 18 }}>
                    馆藏总量：{record.total}
                  </Typography.Text>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Typography.Text style={{ fontSize: 18 }}>
                    借出数量：{record.borrowedNum}
                  </Typography.Text>
                </Col>
              </Row>
            ),
          },
          subTitle: {
            render: (_, record) => (
              //@ts-ignore
              <Tag color={record.total > record.borrowedNum ? 'green' : 'red'}>
                {/*@ts-ignore*/}
                {record.total > record.borrowedNum ? '可借阅' : '已借出'}
              </Tag>
            ),
          },
          actions: {},
        }}
        pagination={{
          pageSizeOptions: [10, 20, 50],
          showQuickJumper: true,
        }}
      />
    </>
  );
};

export default BookList;
