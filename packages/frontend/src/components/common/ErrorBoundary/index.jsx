import React, { Component } from 'react';
import "./style.scss";
import { Button } from 'antd';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='page-not-found'>
          <div className='inside-page-not-found'>            
            <h1>Something went wrong</h1>
            <p>Please refresh the page and try again!</p>
            <Button onClick={() => window.location.reload()}>Click to refresh</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;