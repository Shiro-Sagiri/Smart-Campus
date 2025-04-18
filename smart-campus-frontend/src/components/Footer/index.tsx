import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      copyright={'Shiro'}
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'Smart Campus',
          title: '智慧校园综合服务平台',
          href: 'https://github.com/Shiro-Sagiri/Smart-Campus',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/Shiro-Sagiri/Smart-Campus',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
