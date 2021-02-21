import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Home from './components/Home';
import User from './components/User';
import Student from './components/Student';
import Admin from './components/Admin';
import './App.css';

export default class App extends Component {
  checkUser = () => {
    // 如果 localStorage 中用户信息已经过期，则删除
    const userInfo = JSON.parse(localStorage.getItem('user-info'));
    if (userInfo && userInfo.expireTime < new Date()) {
      localStorage.removeItem('user-info');
    }
  };

  componentDidMount() {
    this.checkUser();
  }

  render() {
    return (
      <div id='App'>
        <Provider store={store}>
          <Router>
            <Switch>
              <Route path='/' exact component={Home} />
              <Route path='/login-and-register' exact component={User} />
              <Route path='/student' component={Student} />
              <Route path='/teacher' component={Admin} />
              <Redirect to='/' />
            </Switch>
          </Router>
        </Provider>
      </div>
    );
  }
}
