import React, { useEffect, useState } from 'react';
import CourseSchedule from '@/components/CourseSchedule';
import { getMyCourseTimetable } from '@/services/smart-campus/courseController';
import { Form, message } from 'antd';
import { ProFormSegmented } from '@ant-design/pro-components';

const CoursePage: React.FC = () => {
  const [courseList, setCourseList] = useState<API.Course[]>([]);
  const [semester, setSemester] = useState<string>('');
  const [form] = Form.useForm();

  const getCurrentSemester = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 1-12

    // 学年计算
    let academicYear;
    if (month >= 9) {
      academicYear = `${year}-${year + 1}`; // 9月开启新学年
    } else {
      academicYear = `${year - 1}-${year}`; // 1-8月属于上学年
    }

    // 学期计算
    let semester;
    if (month >= 9 || month <= 1) {
      // 9月-次年1月为第一学期
      semester = 1;
    } else if (month >= 2 && month <= 6) {
      // 2-6月为第二学期
      semester = 2;
    } else {
      // 7-8月特殊处理（暑假）
      // 按需选择逻辑：
      // 方案1：返回上学期（部分学校暑假前结束学年）
      // 方案2：返回下学期（部分国际学校三学期制）
      // 此处建议根据业务需求处理
      semester = 2; // 默认方案1
    }

    return `${academicYear}-${semester}`;
  };

  // 数据获取封装
  const fetchCourseData = async (currentSemester: string) => {
    try {
      const res = await getMyCourseTimetable({ semester: currentSemester });
      setCourseList(res.data as API.Course[]);
    } catch (error: any) {
      message.error(`获取${currentSemester}学期课表失败: ${error.message}`);
    }
  };

  useEffect(() => {
    // 初始化默认学期
    const defaultSemester = getCurrentSemester();
    form.setFieldsValue({ semester: defaultSemester });
    setSemester(defaultSemester);
    fetchCourseData(defaultSemester);
  }, []);

  // 监听学期选择变化
  const handleSemesterChange = (value: string) => {
    setSemester(value);
    fetchCourseData(value);
  };

  return (
    <div className="page-container">
      <Form form={form}>
        <ProFormSegmented
          name="semester"
          label="学期"
          required
          fieldProps={{
            //@ts-ignore
            onChange: handleSemesterChange,
          }}
          request={async () => {
            const year = new Date().getFullYear();
            return [
              { label: `${year - 1}-${year}-1`, value: `${year - 1}-${year}-1` },
              { label: `${year - 1}-${year}-2`, value: `${year - 1}-${year}-2` },
              { label: `${year}-${year + 1}-1`, value: `${year}-${year + 1}-1` },
              { label: `${year}-${year + 1}-2`, value: `${year}-${year + 1}-2` },
            ];
          }}
        />
      </Form>

      {/* 课程表组件 */}
      <CourseSchedule
        afternoonLength={4}
        totalSections={10}
        //@ts-ignore
        courses={courseList}
        key={semester} // 强制刷新组件
      />
    </div>
  );
};

export default CoursePage;
