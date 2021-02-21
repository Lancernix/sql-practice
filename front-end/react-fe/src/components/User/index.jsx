import React, { Component } from 'react';
import { Tabs } from 'antd';
import Register from './Register';
import Login from './Login';
import './index.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class User extends Component {
  state = {
    tabIndex: '1',
  };

  handleTabChange = (key) => {
    this.setState({ tabIndex: key });
  };

  render() {
    const { user } = this.props;
    if (user.no !== undefined) {
      return (
        <div style={{ paddingTop: 80 }}>
          <h2 style={{ color: 'red' }}>当前存在一个登录用户，请勿重复登录！</h2>
          <p>
            前往<Link to='/'>首页</Link>
          </p>
        </div>
      );
    } else {
      return (
        <div className='sign-area'>
          <div>
            <Tabs defaultActiveKey='1' onChange={this.handleTabChange}>
              <Tabs.TabPane tab='学生登录' key='1'>
                <Login tabIndex={this.state.tabIndex} />
              </Tabs.TabPane>
              <Tabs.TabPane tab='学生注册' key='2'>
                <Register />
              </Tabs.TabPane>
              <Tabs.TabPane tab='教师登录' key='3'>
                <Login tabIndex={this.state.tabIndex} />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      );
    }
  }
}

export default connect((state) => ({ user: state }))(User);
