/**
 * @file editTemplate.jsx 创建端点模板
 * @author xueliqiang@baidu.com
 */
import {Layout, Button, Icon, Input, Row, Col, Tooltip, notification, Table, Divider, message, Spin} from 'antd';
import React, {Component} from 'react';
import style from './editEPTemplate.useable.less';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import common from '../../components/common/common';
import * as api from '../../api/api';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import CreateVersion from '../../components/createVersion/createVersion';
import HeaderComponent from '../../components/header/header';

const {TextArea} = Input;
const {Header, Sider, Content} = Layout;

export default class EditEPTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            endpointConfigName: '',
            endpointConfigDescription: '',
            endpointConfigId: '',
            createTime: '',
            isDescEdit: false,
            // 版本数据源
            versionSource: [],
            // 编辑config弹框是否显示
            editVersionVisible: false,
            // 新建版本弹窗是否显示
            createVersionVisible: false,
            // 编辑弹窗的数据
            versionSourceItem: {},
            sumWeight: 0,
            loading: true
        };
        this.descEditValue = this.state.endpointConfigDescription;
        this.detail = {};

        this.columns = [
            {
                title: '版本名称',
                dataIndex: 'varConfigName',
                key: 'varConfigName'
            }, {
                title: '模型文件',
                dataIndex: 'modelConfigName',
                key: 'modelConfigName'
            }, {
                title: '资源套餐',
                dataIndex: 'resourceConfigName',
                key: 'resourceConfigName'
            }, {
                title: '比重(所占百分比)',
                dataIndex: 'weight',
                key: 'weight',
                render: text => {
                    let dom = <div>
                        {text}
                        {this.state.sumWeight ? '(' + ((text / this.state.sumWeight) * 100).toFixed(0) + '%)' : null}
                    </div>;
                    return dom;
                }
            }, {
                title: '运行实例数量',
                dataIndex: 'instanceCount',
                key: 'instanceCount'
            }, {
                title: '操作',
                dataIndex: 'opertions',
                key: 'opertions',
                render: (text, record) => {
                    return <span>
                        <span className="operation" onClick={this.showEditVersionModal.bind(this, record)}>编辑</span>
                        <Divider type="vertical" />
                        <span className="operation" onClick={this.deleteVersion.bind(this, record)}>删除</span>
                    </span>;
                }
            }
        ];
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    componentDidMount() {
        this.getEndpointConfigDetail();
    }

    /**
     * 显示编辑版本弹框
     *
     * @param {Object} record 选中版本
     */
    showEditVersionModal = record => {
        this.setState({
            editVersionVisible: true,
            versionSourceItem: record
        });
    };

    /**
     * 提交版本修改
     */
    submitUpdateVersion = record => {
        const {variantConfigs} = this.detail;
        let versionIndex = variantConfigs.findIndex(v => v.varConfigId === record.varConfigId);
        if (versionIndex === -1) {
            return;
        }

        variantConfigs.splice(versionIndex, 1, record);
        this.setState({
            editVersionVisible: false,
            loading: true,
            sumWeight: variantConfigs.reduce((cur, v) => v.weight + cur, 0)
        }, () => {
            this.updateEPTemplate().then(() => {
                this.getEndpointConfigDetail();
            }).catch(error => {
                common.getErrorMsg(error);
                this.getEndpointConfigDetail();
            });
        });
    };

    /**
     * 取消版本修改
     */
    cancelEditConfig = () => {
        this.setState({editVersionVisible: false});
    };

    /**
     * 删除版本
     *
     * @param {Object} record 选中版本
     */
    deleteVersion = record => {
        let versionSource = this.state.versionSource;
        if (versionSource.length === 1) {
            message.error('端点模板至少应有一个版本', 2);
        } else {
            this.detail.variantConfigs = this.detail.variantConfigs.filter(v => v.varConfigId !== record.varConfigId);
            this.setState({loading: true});
            this.updateEPTemplate().then(() => {
                this.setState({loading: false}, () => {
                    message.success('删除版本成功', 2);
                });
                this.getEndpointConfigDetail();
            }).catch(error => {
                common.getErrorMsg(error);
                this.setState({loading: false});
            });
        }
    };

    /**
     * 复制成功提醒
     */
    onCopy = () => {
        message.success('复制成功', 2);
    }

    /**
     * 切换备注编辑状态
     */
    switchEditDesc = () => {
        this.setState({isDescEdit: !this.state.isDescEdit});
        this.descEditValue = this.state.endpointConfigDescription;
    }

    /**
     * 保存备注信息
     */
    saveDesc = () => {
        this.setState({loading: true});
        this.updateEPTemplate({endpointConfigDescription: this.descEditValue}).then(() => {
            this.setState({
                endpointConfigDescription: this.descEditValue,
                isDescEdit: false,
                loading: false
            }, () => {this.getEndpointConfigDetail();});
            message.success('更新成功', 2);
        }).catch(error => {
            common.getErrorMsg(error);
            this.setState({
                loading: false,
                isDescEdit: false
            });
        });
    };

    /**
     * 编辑备注信息
     *
     * @param {Event} e event对象
     */
    onDescChange = e => {
        this.descEditValue = common.getInputValue(e);
    };

    /**
     * 新建版本弹窗展示
     */
    showCreateVersionModal = () => {
        this.setState({
            createVersionVisible: true
        });
    };

    /**
     * 关闭新建版本弹窗
     */
    cancelNewVersion = () => {
        this.setState({
            createVersionVisible: false
        });
    };

    /**
     * 新建版本提交
     */
    submitCreateVersion = params => {
        let {variantConfigs} = this.detail;
        variantConfigs.push(params);
        this.setState({
            createVersionVisible: false,
            loading: true,
            sumWeight: variantConfigs.reduce((cur, v) => v.weight + cur, 0)
        }, () => {
            this.updateEPTemplate().then(() => {
                message.success('新建版本成功', 2);
                this.getEndpointConfigDetail();
            }).catch(error => {
                common.getErrorMsg(error);
                this.getEndpointConfigDetail();
            });
        });
    };

    /**
     * 全量更新端点模版
     */
    updateEPTemplate = (params = {}) => {
        let {eTag, endpointConfigId, endpointConfigName, variantConfigs, endpointConfigDescription} = this.detail;
        let data = $.extend(true, {
            eTag,
            endpointConfigId,
            endpointConfigName,
            endpointConfigDescription,
            variantConfigs
        }, params);

        return api.updateEPTemplate(data);
    };

    /**
     * 获取端点模板信息
     */
    getEndpointConfigDetail = () => {
        let endpointConfigId = common.getQueryString('endpointConfigId', this.props.location.search);
        api.getEndpointConfigDetail({endpointConfigId}).then(data => {
            const {createTime, endpointConfigName, endpointConfigDescription, endpointConfigId, variantConfigs} = data;
            let sumWeight = 0;
            let versionSource = variantConfigs.map((v, index) => {
                sumWeight += v.weight;
                return $.extend(true, {key: index}, v);
            });
            this.detail = $.extend(true, {}, data);
            this.setState({
                createTime,
                endpointConfigName,
                endpointConfigDescription,
                endpointConfigId,
                versionSource: [...versionSource],
                sumWeight
            });
        }).then(data => {
            this.setState({loading: false});
        });
    }

    render() {
        const {endpointConfigId, endpointConfigName, endpointConfigDescription, versionSourceItem,
            isDescEdit, createTime, versionSource, editVersionVisible, createVersionVisible, loading} = this.state;

        // const header = <HeaderComponent/>;
        const header = null;
        // 面包屑
        const breadcrumb = <Breadcrumb nav="/?nav=template" breadBrumbText="返回端点模板列表" text={endpointConfigName} />;

        // 编辑备注
        const descDom = isDescEdit ?
            <Col span={16}>
                <TextArea autosize={{minRows: 4, maxRows: 4}} defaultValue={endpointConfigDescription} onChange={this.onDescChange}/>
                <div className="remind">不能超过200个字符</div>
                <div className="btn-group">
                    <Button type="primary" onClick={this.saveDesc} style={{marginRight: '10px'}}>保存</Button>
                    <Button onClick={this.switchEditDesc}>取消</Button>
                </div>
            </Col> :
            <React.Fragment>
                <Col span={6} className="description">{endpointConfigDescription}</Col>
                <Col span={10} className="operation" onClick={this.switchEditDesc}>编辑</Col>
            </React.Fragment>;


        // 基本信息
        const baseInfo = <div className="info-container">
            <div className="info-container-wrapper">
                <h4 className="info-header">基本信息</h4>
                <Row>
                    <Col span={8}>名称：</Col>
                    <Col span={16}>{endpointConfigName}</Col>
                </Row>
                <Row>
                    <Col span={8}>ID：</Col>
                    <Col span={12}>{endpointConfigId}</Col>
                    <CopyToClipboard text={endpointConfigId} onCopy={this.onCopy}>
                        <Tooltip title="复制到剪切板">
                            <Col span={4} className="operation">复制</Col>
                        </Tooltip>
                    </CopyToClipboard>
                </Row>
                <Row>
                    <Col span={8}>备注：</Col>
                    {descDom}
                </Row>
                <Row>
                    <Col span={8}>创建时间：</Col>
                    <Col span={16}> {createTime}</Col>
                </Row>
            </div>
        </div>;

        // 显示配置信息
        const configInfo = <div className="info-container">
            <h4 className="info-header">配置信息</h4>
            <div className="">
                <Row>
                    <Col span={2} style={{lineHeight: '30px'}}>版本配置：</Col>
                    <Col span={22}>
                        <Button type="primary" style={{height: '30px'}} onClick={this.showCreateVersionModal} >
                            <Icon type="plus" />新建版本
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={2}></Col>
                    <Col span={22}>
                        <Table columns={this.columns} dataSource={versionSource} pagination={false}></Table>
                    </Col>
                </Row>
            </div>
        </div>;

        // 编辑配置信息
        const editConfigModal = (
            editVersionVisible
                ? <CreateVersion
                    title="编辑版本"
                    visible={editVersionVisible}
                    onCancel={this.cancelEditConfig}
                    onSubmit={this.submitUpdateVersion}
                    data={versionSourceItem}
                    endpointList ={versionSource}
                />
                : null
        );

        // 新建版本
        const createVersionModal = (
            createVersionVisible
                ? <CreateVersion
                    title="新建版本"
                    visible={createVersionVisible}
                    onCancel={this.cancelNewVersion}
                    onSubmit={this.submitCreateVersion}
                    endpointList={versionSource}
                />
                : null
        );

        const content = <section className="form">
            <div className="form-wrapper">
                {baseInfo} {configInfo}
            </div>
        </section>;

        return <Layout>
            <Header>
                {breadcrumb}
            </Header>
            <Content>
                <Spin spinning={loading}>
                    <div className="container">
                        {content}
                        {editConfigModal} {createVersionModal}
                    </div>
                </Spin>
            </Content>
        </Layout>;
    }
}
