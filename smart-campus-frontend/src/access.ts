export default function access(initialState: { currentUser?: API.UserVO } | undefined) {
  const { currentUser } = initialState ?? {};

  return {
    // 基础角色权限
    isAdmin: currentUser?.role === 'ADMIN',
    isStudent: currentUser?.role === 'STUDENT',
    isTeacher: currentUser?.role === 'TEACHER',

    // 组合权限（示例）
    isTeacherOrStudent: currentUser?.role === 'TEACHER' || currentUser?.role === 'STUDENT',
    isTeacherOrAdmin: currentUser?.role === 'TEACHER' || currentUser?.role === 'ADMIN',

    // 通用权限校验函数
    hasRole: (role: string) => currentUser?.role === role,
  };
}
