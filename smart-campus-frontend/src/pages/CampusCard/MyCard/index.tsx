import React, { useEffect, useState } from 'react';
import { Card, Button, Spin, Alert, message, InputNumber, Modal, Popconfirm } from 'antd';
import {
  getCurrentCampusCard,
  registerCampusCard,
  updateCampusCardById,
} from '@/services/smart-campus/campusCardController';
import { Link } from '@umijs/max';

const MyCard: React.FC = () => {
  const [cardData, setCardData] = useState<API.CampusCard | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [rechargeLoading, setRechargeLoading] = useState(false);

  useEffect(() => {
    // 模拟API调用（参考网页3的数据获取方式）
    const fetchCardData = async () => {
      try {
        // 实际开发中替换为真实API endpoint，如"/api/card"
        const res = await getCurrentCampusCard();
        setCardData(res.data);
      } catch (error) {
        setCardData(undefined);
      } finally {
        setLoading(false);
      }
    };
    fetchCardData();
  }, []);

  if (loading) {
    return <Spin tip="加载校园卡信息..." />;
  }

  const handleRecharge = async () => {
    setRechargeLoading(true);
    try {
      await updateCampusCardById({ id: cardData?.cardId as string }, { balance });
      await message.success('充值成功！');
      setBalance(0);
      setIsRechargeModalOpen(false);
      window.location.reload();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setRechargeLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <Modal
        title="充值余额"
        open={isRechargeModalOpen}
        onOk={handleRecharge}
        confirmLoading={rechargeLoading}
        onCancel={() => setIsRechargeModalOpen(false)}
      >
        <InputNumber
          onChange={(value: number | null) => {
            // 直接使用 value 参数，不是 event 对象
            setBalance(value || 0); // 处理可能的 null 值
          }}
          value={balance}
          style={{ width: '100%' }}
          size={'large'}
          prefix="¥"
          defaultValue={0}
        />
      </Modal>
      {cardData ? (
        <Card
          title="电子校园卡"
          extra={
            <span style={{ color: cardData.isLost ? 'red' : '#52c41a' }}>
              {cardData.isLost ? '已挂失' : '状态正常'}
            </span>
          }
        >
          <div style={{ marginBottom: 16 }}>
            <p>卡号: {cardData.cardId}</p>
            <h3 style={{ color: '#1890ff' }}>余额: ￥{cardData.balance?.toFixed(2)}</h3>
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
            <Button
              type="primary"
              onClick={() => {
                setIsRechargeModalOpen(true);
              }}
            >
              在线充值
            </Button>
            <Link to="/card/record">
              <Button>查看消费记录</Button>
            </Link>
            <Popconfirm
              title={`${cardData.isLost === 0 ? '卡片挂失' : '取消挂失'}`}
              onConfirm={async () => {
                try {
                  await updateCampusCardById(
                    { id: cardData.cardId as any },
                    { isLost: cardData.isLost === 0 ? 1 : 0 },
                  );
                  await message.success(`${cardData.isLost === 1 ? '取消挂失' : '挂失'}成功`);
                  window.location.reload();
                } catch (error: any) {
                  message.error(error.message);
                }
              }}
              description={`${
                cardData.isLost === 0 ? '你确定要挂失此校园卡吗?' : '你确定要取消挂失此校园卡吗?'
              }`}
              okText="是"
              cancelText="否"
              key={'isLost'}
            >
              <Button danger>{`${cardData.isLost === 0 ? '卡片挂失' : '取消挂失'}`}</Button>
            </Popconfirm>
          </div>
        </Card>
      ) : (
        <Card title="校园卡服务">
          <Alert
            message="未注册校园卡"
            description="请先注册开通电子校园卡"
            type="warning"
            showIcon
          />
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              onClick={async () => {
                try {
                  await registerCampusCard();
                  await message.success('注册成功');
                  window.location.reload();
                } catch (error: any) {
                  message.error(error.message);
                }
              }}
            >
              立即注册
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyCard;
