package com.shiro.campus.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shiro.campus.model.vo.Schedule;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedJdbcTypes(JdbcType.VARCHAR)
@MappedTypes(Schedule.class)
public class ScheduleTypeHandler extends BaseTypeHandler<Schedule> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i,
                                    Schedule parameter, JdbcType jdbcType) throws SQLException {
        try {
            ps.setString(i, objectMapper.writeValueAsString(parameter));
        } catch (JsonProcessingException e) {
            throw new SQLException("JSON序列化失败", e);
        }
    }

    @Override
    public Schedule getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return parseJson(rs.getString(columnName));
    }

    @Override
    public Schedule getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        // 根据列索引从 ResultSet 获取 JSON 字符串并解析
        String json = rs.getString(columnIndex);
        return parseJson(json);
    }

    @Override
    public Schedule getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        // 从存储过程的输出参数中获取 JSON 数据
        String json = cs.getString(columnIndex);
        return parseJson(json);
    }

    private Schedule parseJson(String json) {
        try {
            return objectMapper.readValue(json, Schedule.class);
        } catch (IOException e) {
            throw new RuntimeException("JSON解析失败", e);
        }
    }
}