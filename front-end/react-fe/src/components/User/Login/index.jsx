import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { update } from '../../../redux/userAction';

class Login extends Component {
  state = { isSuper: false };

  saveUserInfo = (data) => {
    // 保存用户信息到本地存储
    const now = new Date();
    const expireTime = now.setDate(now.getDate() + 1);
    const userInfo = { ...data, expireTime: expireTime };
    localStorage.setItem('user-info', JSON.stringify(userInfo));
    this.props.update(data);
  };

  componentDidMount() {
    // 判断用户类型并保存在 state 中
    if (this.props.tabIndex === '3') {
      this.setState({ isSuper: true });
    }
  }

  userLogin = async (values) => {
    const postData = { ...values, isSuper: this.state.isSuper };
    try {
      const response = await fetch(`http://localhost:3000/user/login/`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(postData),
      });
      if (response.ok) {
        // 服务器成功返回数据
        const recData = await response.json();
        if (recData.code === 1) {
          // 登录成功
          this.saveUserInfo(recData.data);
          message.success('登录成功！', 2);
          if (this.state.isSuper) {
            this.props.history.replace('/teacher');
          } else {
            this.props.history.replace('/student');
          }
        } else {
          // 登录失败
          message.error('用户名密码不匹配，请重新输入！', 2);
        }
      } else {
        // 服务器 404/500 等错误
        message.info('啊哦，服务器发生错误，请稍后重试', 2);
      }
    } catch (error) {
      // 网络错误等
      message.info('啊哦，发生未知错误，请稍后重试', 2);
    }
  };

  render() {
    return (
      <Form validateTrigger='onSubmit' onFinish={this.userLogin}>
        <Form.Item
          name='no'
          rules={[
            {
              pattern: /^\d{8}$/,
              message: '学工号输入不合法!',
            },
            {
              required: true,
              message: '请输入学工号！',
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder='学工号' />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        >
          <Input prefix={<LockOutlined />} type='password' placeholder='密码' />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect((state) => ({ user: state }), {
  update,
})(withRouter(Login));
