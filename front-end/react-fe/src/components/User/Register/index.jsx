import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { update } from '../../../redux/userAction';

const formItemLayout = {
  labelCol: {
    span: 4,
  },
};

class Register extends Component {
  saveUserInfo = (data) => {
    // 保存用户信息到本地存储
    const now = new Date();
    const expireTime = now.setDate(now.getDate() + 1);
    const userInfo = { ...data, expireTime: expireTime };
    localStorage.setItem('user-info', JSON.stringify(userInfo));
    this.props.update(data);
  };

  userRegister = async (values) => {
    try {
      const response = await fetch(`http://localhost:3000/user/register/`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        // 服务器成功返回数据
        const recData = await response.json();
        if (recData.code === 1) {
          // 注册成功
          this.saveUserInfo(recData.data);
          message.success('注册成功！', 2);
          this.props.history.replace('/student');
        } else {
          // 学号重复
          message.error('当前学号已有人注册，请检查输入或者联系管理员！', 2);
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
      <Form
        {...formItemLayout}
        validateTrigger='onSubmit'
        scrollToFirstError
        onFinish={this.userRegister}
      >
        <Form.Item
          name='no'
          label='学号'
          rules={[
            {
              type: 'string',
              pattern: /^\d{8}$/,
              message: '学号输入不合法!',
            },
            {
              required: true,
              message: '请输入学号！',
            },
          ]}
        >
          <Input placeholder='请输入正确的学号' />
        </Form.Item>

        <Form.Item
          name='name'
          label='姓名'
          rules={[
            {
              required: true,
              message: '请输入姓名！',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='password'
          label='密码'
          rules={[
            {
              pattern: /^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{8,16}$/,
              message: '输入密码不合法！',
            },
            {
              required: true,
              message: '请输入密码!',
            },
          ]}
        >
          <Input.Password placeholder='8-16位数字字母组合' />
        </Form.Item>

        <Form.Item
          name='confirm'
          label='确认密码'
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: '请确认密码！',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject('两次输入密码不一致！');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='group'
          label='班级'
          rules={[
            {
              required: true,
              message: '请输入班级！',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit'>
            注册
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect((state) => ({ user: state }), {
  update,
})(withRouter(Register));
