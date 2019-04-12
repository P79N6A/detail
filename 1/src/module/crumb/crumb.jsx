/**
 * @file 公共页眉
 * @author
 */
import React, {Component} from 'react';

import './crumb.less';

export default class Crumb extends Component {
    render() {
        return (
            <div className="crumb-content">
                <div className="crumb-title">
                    <h2>{this.props.page}</h2>
                    <div className="crumb-right-button">
                        {this.props.buttonNode}
                    </div>
                </div>
                <div className="crumb-children">
                    {this.props.children}
                </div>
            </div>
        );
    }
}


