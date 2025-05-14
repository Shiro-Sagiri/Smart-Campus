import React, { useEffect, useMemo, useState } from 'react';
import { Button, message, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ExcelJS from 'exceljs';
import './style/index.less';
import { saveAs } from 'file-saver';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { getTeacherList } from '@/services/smart-campus/userController';

interface CourseScheduleData {
  weeks: string;
  weekdays: string;
  sections: string;
}

interface CourseItem {
  courseId: number;
  courseName: string;
  semester: string;
  credit: number;
  teacherId: string;
  selected: number;
  maxCapacity: number;
  hours: number;
  schedule: CourseScheduleData;
  location: string;
  type?: 1 | 2;
  _rowSpan?: number;
}

interface ScheduleItem {
  sjd: string;
  jc: number;
  mon?: CourseItem[];
  tue?: CourseItem[];
  wed?: CourseItem[];
  thu?: CourseItem[];
  fri?: CourseItem[];
  sat?: CourseItem[];
  sun?: CourseItem[];
}

const weeks = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const CourseSchedule: React.FC<{
  afternoonLength?: number;
  totalSections?: number;
  courses?: CourseItem[];
}> = ({ afternoonLength = 4, totalSections = 12, courses = [] }) => {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [teacherList, setTeacherList] = useState<API.UserVO[]>([]);
  // 修改状态初始化，添加默认值
  const [teacherMap, setTeacherMap] = useState<Map<string, string>>(
    new Map([['default', '暂无教师']]), // 初始默认值
  );

  // 导出功能核心实现
  const useExportSchedule = (
    scheduleData: any[],
    columns: any[],
    teacherMap: Map<string, string>,
  ) => {
    const exportExcel = async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('课程表');

      // 设置全局样式
      worksheet.properties.defaultRowHeight = 25;

      // 构建表头（动态适配Antd列）
      worksheet.columns = columns.map((col) => ({
        header: col.title,
        key: col.dataIndex,
        width: col.width ? col.width / 5 : 20,
      }));

      // 填充数据
      scheduleData.forEach((scheduleItem, rowIndex) => {
        const rowData: any = {};

        columns.forEach((col) => {
          const cellValue = scheduleItem[col.dataIndex];

          // 处理合并单元格
          if (cellValue?._span) {
            worksheet.mergeCells(
              rowIndex + 2, // 表头占第1行
              //@ts-ignore
              col.dataIndex === 'sjd' ? 1 : col.dataIndex === 'jc' ? 2 : colIndex + 1,
              rowIndex + cellValue._span,
              //@ts-ignore
              col.dataIndex === 'sjd' ? 1 : col.dataIndex === 'jc' ? 2 : colIndex + 1,
            );
          }

          // 转换课程数据
          // 修改导出逻辑中的课程数据处理部分
          // 修改导出函数中的列处理逻辑
          if (weeks.includes(col.dataIndex)) {
            const courses = cellValue as CourseItem[];
            if (courses?.length > 0) {
              // 处理多课程合并展示
              rowData[col.dataIndex] = courses
                .map((course) => {
                  const safeSchedule =
                    typeof course.schedule === 'string'
                      ? JSON.parse(course.schedule)
                      : course.schedule;
                  return [
                    course.courseName,
                    `${safeSchedule?.weeks || '未设置'}周`,
                    teacherMap.get(course.teacherId) || '未知教师',
                    course.location || '未设置地点',
                  ].join('\n');
                })
                .join('\n\n');
            }
          } else {
            rowData[col.dataIndex] = cellValue;
          }
        });

        worksheet.addRow(rowData);
      });

      // 设置表头样式
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE8F5FF' },
        };
        cell.font = { bold: true, name: '微软雅黑' };
      });

      // 生成文件
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, '课程表.xlsx');
    };

    return { exportExcel };
  };

  // 时间段分类
  const getTimePeriod = (index: number) => {
    if (index < 4) return '上午';
    if (index < 4 + afternoonLength) return '下午';
    return '晚上';
  };

  // 生成基础课表结构
  const generateSchedule = () => {
    return Array.from({ length: totalSections }, (_, i) => ({
      sjd: getTimePeriod(i),
      jc: i + 1,
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    }));
  };

  // 时间段行合并逻辑
  const getRowSpan = (index: number) => {
    if (index < 4) return index === 0 ? 4 : 0;
    if (index < 4 + afternoonLength) return index === 4 ? afternoonLength : 0;
    return index === 4 + afternoonLength ? totalSections - 4 - afternoonLength : 0;
  };

  // 核心合并逻辑
  const parseSchedule = useMemo(() => {
    return (courses: CourseItem[]) => {
      const baseSchedule = generateSchedule();

      // 处理每个课程的时间安排
      courses.forEach((course) => {
        const [start, end] = course.schedule.sections.split('-').map(Number);
        const span = end - start + 1;

        course.schedule.weekdays.split(',').forEach((weekday) => {
          const weekKey = weeks[parseInt(weekday) - 1] as keyof ScheduleItem;

          // 处理冲突课程
          for (let j = start - 1; j < end; j++) {
            const cell = baseSchedule[j][weekKey]!;
            if (j === start - 1) {
              // @ts-ignore
              cell.push({ ...course, _rowSpan: span });
            } else {
              // @ts-ignore
              cell.push({ ...course, _rowSpan: 0 });
            }
          }
        });
      });

      return baseSchedule;
    };
  }, [afternoonLength, totalSections]);

  // 辅助组件
  const CourseMetaItem: React.FC<{ icon: React.ReactNode; text?: string }> = ({ icon, text }) =>
    text ? (
      <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
        <span style={{ marginRight: 8 }}>{icon}</span>
        <span>{text}</span>
      </div>
    ) : null;

  // 样式处理
  const getCourseStyle = (type?: 1 | 2) => ({
    borderRadius: 8,
    backgroundColor: type === 1 ? '#2B65EC' : '#7F38EC',
    color: 'white',
    minHeight: 120,
    margin: 4,
  });

  // 课程信息块组件
  const CourseBlock: React.FC<{ course: CourseItem; isMain: boolean }> = ({ course, isMain }) => {
    const teacher = teacherList.find((t) => t.userId === course.teacherId);

    return (
      <div
        className="class-table"
        style={{
          ...getCourseStyle(course.type),
          height: isMain ? '100%' : '50%',
          borderBottom: !isMain ? '1px solid rgba(255,255,255,0.3)' : 'none',
        }}
      >
        <div style={{ padding: 8 }}>
          <div className="course-header">
            <span className="course-title">{course.courseName}</span>
            <Tag color="#fff" style={{ color: getCourseStyle(course.type).backgroundColor }}>
              {course.credit}学分
            </Tag>
          </div>
          <CourseMetaItem
            icon={<ClockCircleOutlined />}
            text={`${course.schedule.weeks}周 | ${course.hours}学时`}
          />
          <CourseMetaItem icon={<EnvironmentOutlined />} text={course.location} />
          <CourseMetaItem icon={<UserOutlined />} text={teacher?.userName || course.teacherId} />
          <CourseMetaItem icon={<UsergroupAddOutlined />} text={`${String(course.selected)}人`} />
        </div>
      </div>
    );
  };

  // 列配置
  const columns: ColumnsType<ScheduleItem> = [
    {
      title: '时间段',
      dataIndex: 'sjd',
      key: 'sjd',
      align: 'center',
      onCell: (_, index) => ({ rowSpan: getRowSpan(index!) }),
    },
    {
      title: '节次',
      dataIndex: 'jc',
      key: 'jc',
      align: 'center',
    },
    ...weeks.map((week, index) => ({
      title: `星期${['一', '二', '三', '四', '五', '六', '日'][index]}`,
      dataIndex: week,
      key: week,
      render: (courses: CourseItem[]) => {
        const validCourses = courses.filter((c) => c._rowSpan !== 0);
        const mainCourse = validCourses[0];

        return mainCourse
          ? {
              children: (
                <div style={{ height: 120 * (mainCourse._rowSpan || 1) }}>
                  {validCourses.map((course, i) => (
                    <CourseBlock key={i} course={course} isMain={i === 0} />
                  ))}
                </div>
              ),
              props: {
                rowSpan: mainCourse._rowSpan,
                style: { padding: 0 },
              },
            }
          : null;
      },
    })),
  ];

  // 修改useEffect中的教师数据加载
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await getTeacherList();
        const list = res.data || [];
        setTeacherList(list);
        // 直接在此处更新map，避免状态延迟
        const newMap = new Map(list.map((t) => [t.userId, t.userName || '未知教师']));
        // @ts-ignore
        setTeacherMap(newMap);
      } catch (error) {
        message.error('教师数据加载失败');
      }
    };
    fetchTeacherData();
  }, []);

  useEffect(() => {
    setScheduleData(parseSchedule(courses));
  }, [courses, parseSchedule]);

  //@ts-ignore
  const { exportExcel } = useExportSchedule(scheduleData, columns, teacherMap);

  return (
    <div>
      <Button type="primary" onClick={exportExcel} style={{ marginBottom: 16 }}>
        导出课表
      </Button>
      <Table<ScheduleItem>
        bordered
        rowKey="jc"
        columns={columns}
        dataSource={scheduleData}
        pagination={false}
        components={{
          body: {
            // @ts-ignore
            cell: ({ children, ...props }) => (
              <td
                {...props}
                style={{
                  ...props.style,
                  verticalAlign: 'top',
                  padding: 0,
                  height: props.rowSpan ? 120 * props.rowSpan : 120,
                }}
              >
                {children}
              </td>
            ),
          },
        }}
      />
    </div>
  );
};

//@ts-ignore
export default CourseSchedule;
