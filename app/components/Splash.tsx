import { Component } from 'react';
import React from 'react'
import { Link } from 'react-router-dom';

export class Splash extends Component<Object, Object> {
  render() {
    return (
      <div>
        Loading...
        <Link to="/app" >
          app
        </Link>
        <Link to="/counter">
          counter
        </Link>
      </div>
    )
  }
}



