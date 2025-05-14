import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { LockOutlined } from '@ant-design/icons';
import { Form, Input, Button, message, Card } from 'antd';
import { useModel } from '@umijs/max';
import { logout, updatePassword } from '@/services/smart-campus/userController';

const PasswordSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { initialState } = useModel('@@initialState');

  // 密码复杂度正则（至少包含数字、大小写字母、特殊符号中的三种）
  const passwordRegex =
    /^(?![a-zA-Z]+$)(?![A-Z\d]+$)(?![A-Z_!@#$%^&*]+$)(?![a-z\d]+$)(?![a-z_!@#$%^&*]+$)(?![\d_!@#$%^&*]+$)[\w!@#$%^&*]{8,16}$/;

  const onFinish = async (values: API.ChangePasswordRequest) => {
    try {
      setLoading(true);
      const response = await updatePassword({
        ...values,
        userId: initialState?.currentUser?.userId,
      });

      if (response.code === 0) {
        message.success('密码修改成功，请重新登录');
        await logout();
        window.location.reload();
        form.resetFields();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="账户安全">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Card
          bordered={false}
          style={{
            width: '100%',
            maxWidth: 600,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <Form.Item
              label="当前密码"
              name="oldPassword"
              rules={[
                { required: true, message: '请输入当前密码' },
                { min: 8, message: '密码长度至少8位' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="默认密码11111111" />
            </Form.Item>

            <Form.Item
              label="新密码"
              name="newPassword"
              rules={[
                { required: true, message: '请输入新密码' },
                { pattern: passwordRegex, message: '需包含数字、大小写字母、特殊符号中至少三种' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value === getFieldValue('oldPassword')) {
                      return Promise.reject(new Error('新密码不能与旧密码相同'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined />} placeholder="8-16位，包含数字/字母/符号" />
            </Form.Item>

            <Form.Item
              label="确认新密码"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: '请确认新密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="请再次输入新密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                确认修改
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </PageContainer>
  );
};

export default PasswordSettings;
