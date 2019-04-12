/* eslint-disable */
/**
 * raact 动态载入组件
 * @file asyncComponent
 * @author yangxiaoxu@baidu.com
 */
import React from 'react';
export const asyncComponent = loadComponent => (
    class AsyncComponent extends React.Component {
        constructor(props) {
            super(props);
            this.status = true;
        }

        state = {
            Component: null
        }

        componentWillUnmount() {
            this.status = false;
        }

        componentDidMount() {
            if (this.hasLoadedComponent()) {
                return;
            }

            loadComponent()
                .then(module => module.default)
                .then((Component) => {
                    this.status && this.setState({Component});
                })
                .catch((err) => {
                    console.error(`Cannot load component in <AsyncComponent />`);
                    throw err;
                });
        }

        hasLoadedComponent() {
            return this.state.Component !== null;
        }

        render() {
            const {Component} = this.state;
            return (Component) ? <Component {...this.props} /> : null;
        }
    }
);
