/**
 * @file 模型默认页
 * @author
 * @reviewer yangxiaoxu@baidu.com
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Icon} from 'antd';
import Crumb from '../../../module/crumb/crumb.jsx';
import ModelList from '../modelList/modelList.jsx';
import bg from '../../../module/img/Group.png';
class ModelIndex extends Component {
    render() {
        let buttonNode = (
            <Button
                type="primary"
                size="large"
                onClick= {() => this.props.history.push('/model/add')}
            >
                <Icon type="plus" />添加模型
            </Button>
        );
        return (
            <Crumb
                page={this.props.title}
                buttonNode={buttonNode}
            >
                <div className="model-layout">
                    <ModelList/>
                    <div className="model-main">
                        <div className ="model-bg">
                            <img src = {bg}/>
                            <p>请点击左侧模型列表，查看所需要的模型</p>
                        </div>
                    </div>
                </div>
            </Crumb>
        );
    }
}

export default withRouter(ModelIndex);
