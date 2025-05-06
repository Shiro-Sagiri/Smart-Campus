import {
  ProCard,
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-components';
import { Flex, message } from 'antd';
import { history } from '@umijs/max';
import { uploadFile } from '@/services/smart-campus/fileController';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from '@@/exports';
import { ProFormInstance } from '@ant-design/pro-components';
import { addBook, getBookById, updateBookById } from '@/services/smart-campus/bookController';

const AddOrUpdate: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const [bookData, setBookData] = useState<API.Book>();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const res = await getBookById({ id: id as string });
        setBookData(res.data);
        formRef.current?.setFieldsValue({
          title: res.data?.title,
          author: res.data?.author,
          status: res.data?.status,
          description: res.data?.description,
          publisherName: res.data?.publisherName,
          publishDate: res.data?.publishDate,
          total: res.data?.total,
          cover: res.data?.cover
            ? [
                {
                  uid: '-1',
                  name: 'avatar',
                  status: 'done',
                  url: res.data?.cover,
                },
              ]
            : [],
        });
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBookData();
    }
  }, [id]);

  const addOrUpdateBook = async (formData: API.BookAddRequest) => {
    try {
      formData.cover = url ? url : bookData?.cover;
      formData.status = 'AVAILABLE';
      if (!id) {
        await addBook(formData);
      } else {
        await updateBookById({ id: id as any }, formData);
      }
      const { from = '/book/list' } = (history.location.state as any) || {};
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
          <ProForm<API.BookAddRequest>
            onFinish={addOrUpdateBook}
            loading={loading}
            formRef={formRef}
          >
            <ProFormUploadButton
              name="cover"
              label="封面"
              max={1}
              fieldProps={{
                name: 'file',
                listType: 'picture-card',
                customRequest: async (options) => {
                  const { file, onSuccess, onError } = options;
                  const formData = new FormData();
                  formData.append('file', file);
                  try {
                    const res = await uploadFile(formData);
                    onSuccess?.(res, file);
                    setUrl(res.data as string);
                  } catch (error: any) {
                    message.error(error.message);
                    onError?.(error);
                  }
                },
              }}
            />
            <ProFormText
              width="lg"
              name="title"
              required
              label="书名"
              placeholder="请输入书名"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormText
              width="lg"
              name="author"
              required
              label="作者"
              placeholder="请输入作者"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormTextArea width="lg" name="description" label="简介" placeholder="请输入简介" />
            <ProFormText
              width="lg"
              name="publisherName"
              required
              label="出版社名称"
              placeholder="请输入出版社名称"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormDatePicker
              width="lg"
              name="publishDate"
              required
              label="出版时间"
              placeholder="请输入出版时间"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormDigit
              width="lg"
              name="total"
              required
              label="馆藏总量"
              placeholder="请输入馆藏总量"
              rules={[{ required: true, message: '这是必填项' }]}
            />
          </ProForm>
        </Flex>
      </ProCard>
    </>
  );
};

export default AddOrUpdate;
