import React from 'react';
import { useParams } from '@@/exports';

const Detail: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // 类型标记为可选
  return <div>{id}</div>;
};

export default Detail;
