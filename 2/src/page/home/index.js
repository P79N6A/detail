/**
 * @file 首页
 * @author luoxiaolan@badu.com
 */

import React from 'react';
import {connect} from 'react-redux';
import {bankList} from '../../conf/configParams';

class Home extends React.Component {
    findBankName = code => {
        const bankObj = bankList.find(item => item.code === code);

        if (bankObj) {
            return bankObj.name;
        }
    }

    render() {
        const userInfo = this.props.userInfo.userInfo;

        return <p style={{textAlign: 'center', marginTop: '20%'}}>
            欢迎来到{userInfo && userInfo.bankCode && this.findBankName(userInfo.bankCode)}AI工程平台管理后台
        </p>;
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo
});

export default connect(mapStateToProps)(Home);
