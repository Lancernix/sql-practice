import React, { Component } from 'react';
import {
  Layout,
  Form,
  Input,
  Button,
  Card,
  message,
  Alert,
  Divider,
} from 'antd';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { update, remove } from '../../redux/userAction';
import Foot from '../Foot';
import './index.css';

const { Header, Content } = Layout;
const { TextArea } = Input;

class Student extends Component {
  state = { questionList: [], isLoading: true };

  // 获取数据
  getQuestionList = async () => {
    try {
      const response = await fetch(`http://localhost:3000/student/`);
      if (response.ok) {
        const recData = await response.json();
        this.setState({ questionList: recData, isLoading: false });
      } else {
        this.setState({ isLoading: true });
        if (response.status === 403) {
          // 若用户自行删除 cookie 或者 未登录
          localStorage.removeItem('user-info'); // new
          this.props.remove();
          this.props.history.replace('/login-and-register');
        } else {
          message.info('啊哦，服务器发生错误，请稍后重试', 2);
        }
      }
    } catch (error) {
      // 网络错误等
      this.setState({ isLoading: true });
      message.info('啊哦，发生未知错误，请稍后重试', 2);
    }
  };

  // 注销用户
  logout = async () => {
    try {
      const response = await fetch(`http://localhost:3000/user/logout/`);
      if (response.ok) {
        const recData = await response.json();
        if (recData.code === 1) {
          // 执行注销操作
          localStorage.removeItem('user-info');
          this.props.remove();
          this.props.history.push('/home');
        }
      } else {
        if (response.status === 403) {
          // 若用户自行删除 cookie，则更新 localStorage 中保存的信息
          localStorage.removeItem('user-info');
          this.props.remove();
          this.props.history.push('/home');
        } else {
          message.info('啊哦，服务器发生错误，请稍后重试', 2);
        }
      }
    } catch (error) {
      // 网络错误等
      message.info('啊哦，发生未知错误，请稍后重试', 2);
    }
  };

  // 提交答案
  postAnswers = async (values) => {
    // 获取 csrftoken
    const csrftoken = Cookies.get('csrftoken');
    try {
      const response = await fetch(`http://localhost:3000/student/`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        // 服务器成功返回数据
        const recData = await response.json();
        if (recData.code === 1) {
          // 提交成功
          message.success('交卷成功！', 2);
          // 更新状态
          const userInfo = JSON.parse(localStorage.getItem('user-info'));
          userInfo.finished = true;
          localStorage.setItem('user-info', JSON.stringify(userInfo));
          this.props.update(recData.data);
        }
      } else {
        if (response.status === 403) {
          // 若用户自行删除 cookie 或 登录过期
          localStorage.removeItem('user-info');
          this.props.remove();
          this.props.history.replace('/login-and-register');
        } else {
          message.info('啊哦，服务器发生错误，请稍后重试', 2);
        }
      }
    } catch (error) {
      // 网络错误等
      message.info('啊哦，发生未知错误，请稍后重试', 2);
    }
  };

  componentDidMount() {
    if (!this.props.user.no) {
      this.props.history.replace('/login-and-register');
    } else {
      this.getQuestionList();
    }
  }

  render() {
    const { user } = this.props;
    return (
      <Layout className='layout'>
        <Header style={{ height: 60, color: 'white' }}>
          <span>
            {user.no}&nbsp;--&nbsp;{user.name}&nbsp;--&nbsp;
            <span
              style={{
                color: user.finished ? '#42B983' : '',
                fontWeight: user.finished ? 'bolder' : '',
              }}
            >
              {user.finished ? '已完成' : '未提交'}
            </span>
          </span>
          <Button
            type='primary'
            ghost
            style={{ marginLeft: 20 }}
            onClick={this.logout}
          >
            退出登录
          </Button>
        </Header>
        <Content style={{ minHeight: 'calc(100vh - 120px)' }}>
          <Alert
            description='题目只有一次提交机会，请认真作答后提交！建议粘贴整条 SQL 语句到输入框中，逐字输入可能会由于中英符号不同而影响答案的判定结果'
            type='error'
            className='alert'
            closable
          />
          <Divider style={{ marginBottom: 0 }} />
          <Card
            loading={this.state.isLoading}
            bodyStyle={{ padding: 10 }}
            bordered={false}
          >
            <Form
              className='question-form'
              validateTrigger='onSubmit'
              layout='vertical'
              requiredMark={false}
              onFinish={this.postAnswers}
            >
              {this.state.questionList.map((question) => (
                <Form.Item
                  key={question.id}
                  label={`${question.id}. ${question.content}`}
                  name={`answer${question.id}`}
                  className='question'
                  rules={[
                    {
                      required: true,
                      message: '请填写你的答案！',
                    },
                  ]}
                >
                  <TextArea autoSize />
                </Form.Item>
              ))}
              <Form.Item style={{ marginTop: 10 }}>
                <Button
                  type='primary'
                  htmlType='submit'
                  size='large'
                  disabled={user.finished}
                >
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
        <Foot />
      </Layout>
    );
  }
}

export default connect((state) => ({ user: state }), {
  update,
  remove,
})(Student);
