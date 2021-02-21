import React, { Component } from 'react';
import { Table, message, Layout, Button, Row, Col, Statistic } from 'antd';
import { connect } from 'react-redux';
import { remove } from '../../redux/userAction';

const { Header, Content } = Layout;

class Admin extends Component {
  state = {
    studentList: [],
  };

  getStudentList = async () => {
    try {
      const response = await fetch(`http://localhost:3000/teacher/`);
      if (response.ok) {
        const recData = await response.json();
        this.setState({ studentList: recData });
      } else {
        if (response.status === 403) {
          // 若用户自行删除 cookie 或者 未登录
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
    } else if (!this.props.user.isSuper) {
      message.error('无权限访问！！', 2);
      setTimeout(() => this.props.history.replace('/home'), 2000);
    } else {
      this.getStudentList();
    }
  }

  render() {
    const dataSource = this.state.studentList.map((item) => ({
      key: item.no,
      name: item.username,
      grade: item.class_grade,
      finished: item.finished ? '是' : '否',
      score: item.score,
    }));

    const columns = [
      {
        title: '学号',
        dataIndex: 'key',
        key: 'no',
        width: '20%',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
      },
      {
        title: '班级',
        dataIndex: 'grade',
        key: 'grade',
        width: '20%',
      },
      {
        title: '是否提交',
        dataIndex: 'finished',
        key: 'finished',
        width: '20%',
      },
      {
        title: '得分',
        dataIndex: 'score',
        key: 'score',
        width: '20%',
      },
    ];

    const { user } = this.props;
    const stuNum = this.state.studentList.length;
    const finishedNum = this.state.studentList.length
      ? this.state.studentList.reduce(
          (total, cur) => total + (cur.finished ? 1 : 0),
          0
        )
      : 0;

    return (
      <Layout>
        <Header style={{ height: 60, color: 'white' }}>
          <span>
            {user.no}&nbsp;--&nbsp;{user.name}
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
        <Content style={{ minHeight: 'calc(100vh - 60px)' }}>
          <Row
            style={{
              width: '60%',
              margin: '20px auto',
              paddingTop: 8,
              backgroundColor: '#75cfb8',
              border: '1px solid #75cfb8',
              borderRadius: 8,
            }}
          >
            <Col offset={6} span={6}>
              <Statistic title='注册学生人数' value={stuNum} />
            </Col>
            <Col span={6}>
              <Statistic title='完成学生人数' value={finishedNum} />
            </Col>
          </Row>
          <div style={{ width: '75%', margin: '20px auto' }}>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default connect((state) => ({ user: state }), {
  remove,
})(Admin);
