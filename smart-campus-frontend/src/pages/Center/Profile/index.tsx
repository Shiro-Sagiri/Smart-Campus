import React, { useState } from 'react';
import { ProDescriptions, PageContainer } from '@ant-design/pro-components';
import { Avatar, message, Form, Card, Upload } from 'antd';
import { useModel } from '@umijs/max';
import { uploadFile } from '@/services/smart-campus/fileController';
import { updateUserById } from '@/services/smart-campus/userController';
import { RcFile } from 'antd/es/upload';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';

const PersonalInfoPage: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  // 头像上传前校验
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式!');
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('图片大小不能超过10MB!');
    }
    return isJpgOrPng && isLt10M;
  };

  // 头像上传控件（网页6样式优化）
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <CameraOutlined />}
      <div style={{ marginTop: 8 }}>更换头像</div>
    </div>
  );

  return (
    <PageContainer title="个人信息">
      <Card>
        <div style={{ display: 'flex', gap: 40 }}>
          <Form.Item name="avatar">
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              // onChange={handleChange}
              customRequest={async (options) => {
                setLoading(true);
                const { file, onSuccess, onError } = options;
                const formData = new FormData();
                formData.append('file', file);
                try {
                  const res = await uploadFile(formData);
                  await updateUserById(
                    {
                      //@ts-ignore
                      id: currentUser?.userId,
                    },
                    {
                      userAvatar: res.data,
                    },
                  );
                  message.success('头像上传成功');
                  onSuccess?.(res, file);
                  setImageUrl(res.data as string);
                } catch (error: any) {
                  message.error(error.message);
                  onError?.(error);
                } finally {
                  setLoading(false);
                }
              }}
            >
              {imageUrl ? (
                <Avatar src={imageUrl} size={128} style={{ borderRadius: 8 }} />
              ) : (
                <Avatar src={currentUser?.userAvatar} size={128} style={{ borderRadius: 8 }}>
                  {uploadButton}
                </Avatar>
              )}
            </Upload>
          </Form.Item>

          {/* 个人信息展示（网页4的ProDescriptions方案） */}
          <ProDescriptions column={2} bordered dataSource={currentUser}>
            <ProDescriptions.Item label="用户名" dataIndex="userName" span={2} />
            <ProDescriptions.Item label={'学号/工号'} dataIndex="userId" />
            <ProDescriptions.Item label="所属班级" dataIndex="classId" />
            <ProDescriptions.Item label="专业名称" dataIndex="majorName" />
            <ProDescriptions.Item label="学院名称" dataIndex="collegeName" />
            <ProDescriptions.Item label="电子邮箱" dataIndex="email" />
            <ProDescriptions.Item label="手机号码" dataIndex="phone" />
            <ProDescriptions.Item
              label="注册时间"
              dataIndex="createdTime"
              valueType="dateTime"
              span={2}
            />
          </ProDescriptions>
        </div>
      </Card>
    </PageContainer>
  );
};

export default PersonalInfoPage;
