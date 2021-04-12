import React, { Component } from 'react';
import { Layout, Alert, Card } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Foot from '../Foot';
import './index.css';

const { Content } = Layout;

class Home extends Component {
  render() {
    const { user } = this.props;
    return (
      <Layout className='layout'>
        <Content id='Home'>
          <Alert
            message='欢迎使用 SQL 实验平台'
            type='info'
            className='welcome'
          />
          <Card
            className='info'
            style={{ boxShadow: '0 0 10px rgba(0, 64, 128, 20%)' }}
          >
            {user.no ? (
              <>
                <p>
                  当前登录账户为：{user.no}，账号类型：
                  {user.isSuper ? '管理员' : '学生'}
                </p>
                {user.isSuper ? (
                  <p style={{ margin: 0 }}>
                    前去<Link to='/teacher'>管理员详情页</Link>
                  </p>
                ) : (
                  <p style={{ margin: 0 }}>
                    前去<Link to='/student'>答题页面</Link>
                  </p>
                )}
              </>
            ) : (
              <>
                <p>当前还未登录</p>
                <p>
                  前去<Link to='/login-and-register'>登录/注册</Link>
                </p>
              </>
            )}
          </Card>
        </Content>
        <Foot />
      </Layout>
    );
  }
}

export default connect((state) => ({ user: state }))(Home);
