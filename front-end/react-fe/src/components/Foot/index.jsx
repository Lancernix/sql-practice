import React, { Component } from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

export default class Foot extends Component {
  render() {
    return (
      <Footer
        style={{
          height: 60,
          textAlign: 'center',
          backgroundColor: '#001529',
          color: 'white',
        }}
      >
        <p>有问题请联系：xxxxxxxx</p>
      </Footer>
    );
  }
}
