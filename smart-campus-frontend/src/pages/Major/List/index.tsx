import React, { useEffect, useRef, useState } from 'react';
import { ActionType, type ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { history, Link } from '@umijs/max';
import { deleteMajorById, listMajorByPage } from '@/services/smart-campus/majorController';
import { FundProjectionScreenOutlined } from '@ant-design/icons';
import { listCollege } from '@/services/smart-campus/collegeController';

const MajorList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [collegeList, setCollegeList] = useState<API.College[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCollegeData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const response = await listCollege();
        setCollegeList(response.data as any);
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCollegeData();
  }, []); // 空依赖数组表示仅执行一次
  const columns: ProColumns<API.Major>[] = [
    {
      title: '专业编号',
      dataIndex: 'majorId',
      // tip: 'The rule name is the unique key',
      render: (dom) => {
        return <a onClick={() => {}}>{dom}</a>;
      },
    },
    {
      title: '所属学院',
      dataIndex: 'collegeId',
      valueType: 'select', // 关键属性
      search: {
        transform: (value) => ({ collegeId: value }), // 参数转换[4](@ref)
      },
      fieldProps: {
        // 下拉框配置
        options: collegeList.map((college) => ({
          label: college.collegeName,
          value: college.collegeId,
        })),
        showSearch: true, // 启用搜索功能
        optionFilterProp: 'label', // 按学院名称过滤
      },
      // 原有render保持不动
      render: (_, record) => {
        return collegeList.find((item) => item.collegeId === record.collegeId)?.collegeName;
      },
    },
    {
      title: '专业名称',
      dataIndex: 'majorName',
      valueType: 'text',
    },
    {
      title: '专业简介',
      dataIndex: 'description',
      valueType: 'textarea',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Link key={'edit'} to={`/major/addOrUpdate/${record.majorId}`}>
          编辑
        </Link>,
        <Popconfirm
          title="删除专业"
          onConfirm={async () => {
            try {
              await deleteMajorById({ id: record.majorId as any });
              message.success('删除成功！');
              actionRef.current?.reload(); // 重新加载表格数据
            } catch (error: any) {
              message.error(error.message);
            }
          }}
          description="你确定要删除此专业吗?"
          okText="是"
          cancelText="否"
          key={'delete'}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <ProTable<API.Major, API.MajorQueryRequest>
      loading={loading}
      actionRef={actionRef}
      request={async (
        // 第一个参数 params 查询表单和 params 参数的结合
        // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
        params: API.MajorQueryRequest,
      ) => {
        // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
        // 如果需要转化参数可以在这里进行修改
        const msg = await listMajorByPage({
          current: params.current,
          pageSize: params.pageSize,
          majorId: params.majorId,
          majorName: params.majorName,
          collegeId: params.collegeId,
        });
        return {
          data: msg.data?.records,
          // success 请返回 true，
          // 不然 table 会停止解析数据，即使有数据
          success: true,
          // 不传会使用 data 的长度，如果是分页一定要传
          total: msg.data?.total,
        };
      }}
      columns={columns}
      toolBarRender={() => [
        <Button
          onClick={() => {
            history.push('/major/addOrUpdate', {
              from: history.location.pathname + history.location.search,
            });
          }}
          size={'large'}
          key="add"
          type={'primary'}
          icon={<FundProjectionScreenOutlined />}
        >
          添加专业
        </Button>,
      ]}
    />
  );
};

export default MajorList;
