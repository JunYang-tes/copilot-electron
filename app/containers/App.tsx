import { Component } from 'react';
import { Children } from 'react';
import React from 'react';

interface Props {

};

export default class App extends Component<Props, Object> {
  render() {
    return (
      <div className="app">
        {this.props.children}
      </div>
    );
  }
}
