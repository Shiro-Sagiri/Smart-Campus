import { ProCard, ProForm, ProFormUploadButton } from '@ant-design/pro-components';
import { ProFormText } from '@ant-design/pro-components';
import { Flex, message } from 'antd';
import { history } from '@umijs/max';
import { uploadFile } from '@/services/smart-campus/fileController';
import { addUser, getUserById, updateUserById } from '@/services/smart-campus/userController';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from '@@/exports';
import { ProFormInstance } from '@ant-design/pro-components';

const AddOrUpdate: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const [userData, setUserData] = useState<API.UserVO>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const res = await getUserById({ id: id as string });
        setUserData(res.data);
        formRef.current?.setFieldsValue({
          userName: res.data?.userName,
          phone: res.data?.phone,
          email: res.data?.email,
          userAvatar: res.data?.userAvatar
            ? [
                {
                  uid: '-1',
                  name: 'avatar',
                  status: 'done',
                  url: res.data?.userAvatar,
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
    if (id?.length === 10) {
      fetchUserData();
    }
  }, [id]);

  const addOrUpdateUser = async (formData: API.UserAddRequest) => {
    try {
      formData.userAvatar = url ? url : userData?.userAvatar;
      if (id?.length === 8) {
        formData.password = '11111111'; //默认密码
        formData.role = 'STUDENT';
        formData.classId = id;
        await addUser(formData);
      } else {
        await updateUserById({ id: id as any }, formData as any);
      }
      const { from = `/class/student/${id?.length === 10 ? id.substring(0, 8) : id}` } =
        (history.location.state as any) || {};
      history.push(from);
      message.success(`${id?.length === 10 ? '编辑' : '添加'}成功！`);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <>
      <h2>{id?.length === 10 ? '编辑学生' : '添加学生'}</h2>
      <ProCard>
        <Flex justify={'center'} align={'center'}>
          <ProForm<API.UserAddRequest>
            onFinish={addOrUpdateUser}
            loading={loading}
            formRef={formRef}
          >
            <ProFormUploadButton
              name="userAvatar"
              label="头像上传"
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
              name="userName"
              required
              label="姓名"
              placeholder="请输入姓名"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormText
              width="lg"
              name="phone"
              required
              label="手机号"
              placeholder="请输入手机号"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormText width="lg" name="email" label="邮箱" placeholder="请输入邮箱" />
          </ProForm>
        </Flex>
      </ProCard>
    </>
  );
};

export default AddOrUpdate;
