import {
  addSurvey,
  getSurveyVoById,
  updateSurveyById,
} from '@/services/smart-campus/surveyController';
import { useParams } from '@@/exports';
import {
  ProCard,
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Flex, Form, message, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const AddOrUpdate: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  const [loading, setLoading] = useState(false);
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        // 替换为你的API请求
        const res = await getSurveyVoById({ id: id as string });
        // 修改useEffect中的setFieldsValue
        formRef.current?.setFieldsValue({
          ...res.data,
          time: [res.data?.startTime, res.data?.endTime],
          surveyQuestionList: res.data?.questionList?.map((q) => ({
            ...q,
            // 确保options字段存在（antd要求初始化时字段存在）
            options: q.options || [],
          })),
        });
      } catch (error: any) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchSurveyData();
    }
  }, [id]);

  const addOrUpdateSurvey = async (formData: API.SurveyAddRequest) => {
    try {
      const transformed = {
        ...formData,
        surveyQuestionList: formData.surveyQuestionList?.map((q) => ({
          ...q,
          // 文本题不需要options字段
          options: ['RADIO', 'MULTIPLE'].includes(q.type as string)
            ? q.options?.filter((opt) => !!opt)
            : undefined,
        })),
      };
      if (!id) {
        await addSurvey(transformed);
      } else {
        await updateSurveyById({ id: id as any }, transformed);
      }
      const { from = '/survey/list' } = (history.location.state as any) || {};
      history.push(from);
      message.success(`${id ? '编辑' : '添加'}成功！`);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <>
      <h2>{id ? '编辑问卷' : '添加问卷'}</h2>
      <ProCard>
        <Flex justify={'center'} align={'center'}>
          <ProForm<API.SurveyAddRequest>
            onFinish={addOrUpdateSurvey}
            loading={loading}
            formRef={formRef}
          >
            <ProFormText
              width="lg"
              name="title"
              required
              label="问卷标题"
              placeholder="请输入问卷标题"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormTextArea
              width="lg"
              name="description"
              required
              label="描述"
              placeholder="请输入描述"
              rules={[{ required: true, message: '这是必填项' }]}
            />
            <ProFormDateTimeRangePicker
              label="时间范围"
              name="time"
              transform={(value) => ({
                startTime: value?.[0],
                endTime: value?.[1],
              })}
              required
              rules={[{ required: true, message: '这是必选项' }]}
            />
            <Form.List name="surveyQuestionList">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <ProCard
                      key={key}
                      title={`题目 ${name + 1}`}
                      extra={
                        <Button danger onClick={() => remove(name)}>
                          删除
                        </Button>
                      }
                      style={{ marginBottom: 16 }}
                    >
                      {/* 问题类型 */}
                      <ProForm.Item
                        {...restField}
                        name={[name, 'type']}
                        label="题型"
                        rules={[{ required: true }]}
                      >
                        <Select
                          options={[
                            { label: '单选题', value: 'RADIO' },
                            { label: '多选题', value: 'MULTIPLE' },
                            { label: '文本题', value: 'TEXT' },
                          ]}
                        />
                      </ProForm.Item>

                      {/* 题干内容 */}
                      <ProFormTextArea
                        {...restField}
                        name={[name, 'content']}
                        label="题干"
                        rules={[{ required: true }]}
                        placeholder="请输入问题内容"
                        trigger="onChange" // 增加值变化监听
                      />

                      {/* 动态选项（仅选择题显示） */}
                      <Form.Item
                        extra="至少需要两个选项"
                        noStyle
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.surveyQuestionList?.[name]?.type !==
                          curValues.surveyQuestionList?.[name]?.type
                        }
                      >
                        {({ getFieldValue }) => {
                          const currentType = getFieldValue(['surveyQuestionList', name, 'type']);
                          return (
                            ['RADIO', 'MULTIPLE'].includes(currentType) && (
                              <Form.List name={[name, 'options']}>
                                {(optFields, { add: addOpt, remove: removeOpt }) => (
                                  <>
                                    {optFields.map(({ key: optKey, name: optName }) => (
                                      <ProForm.Item key={optKey}>
                                        <Flex gap={8}>
                                          <ProFormText
                                            label={`选项 ${optName + 1}`}
                                            name={[optName]} // 修正为一级路径
                                            placeholder="请输入选项内容"
                                            rules={[{ required: true }]}
                                          />
                                        </Flex>
                                        {optFields.length > 2 && (
                                          <Button
                                            danger
                                            onClick={() => removeOpt(optName)}
                                            style={{ marginTop: 8 }}
                                          >
                                            删除
                                          </Button>
                                        )}
                                      </ProForm.Item>
                                    ))}
                                    <Button
                                      type="dashed"
                                      onClick={() => addOpt()}
                                      block
                                      style={{ marginTop: 16, marginBottom: 16 }}
                                    >
                                      添加选项
                                    </Button>
                                  </>
                                )}
                              </Form.List>
                            )
                          );
                        }}
                      </Form.Item>
                    </ProCard>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() =>
                      add({
                        type: 'RADIO',
                        options: ['选项1', '选项2'],
                      })
                    }
                    block
                    style={{ marginTop: 16, marginBottom: 16 }}
                  >
                    添加题目
                  </Button>
                </>
              )}
            </Form.List>
          </ProForm>
        </Flex>
      </ProCard>
    </>
  );
};

export default AddOrUpdate;
