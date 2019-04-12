/**
 * @file 常见问题
 * @author
 */

import React, {Component} from 'react';

// 业务组件
import Crumb from '../../module/crumb/crumb.jsx';
import style from './qa.useable.less';

export default class LoginPage extends Component {
    componentWillMount() {
        style.use();
    }
    componentWillUnmount() {
        style.unuse();
    }
    render() {
        return (
            <Crumb page="融智一体机-决策平台使用简介">
                <div className="qa-content">
                    <p className="qa-item-strong-title">1. 系统简介</p>
                    <p className="qa-item-strong-sub-title">1.1 决策平台是什么？</p>
                    <p className="qa-item-article">一体机决策平台操作系统连接一体机建模平台（思维引擎）和业务方自有系统，操作者可导入本地建模平台发布的模型，针对模型结果自行配置规则、自定义决策结果并查看统计和决策报告，最终确定的最优决策，可生成服务API集成至自有系统。决策平台模块架构如下图</p>
                    <div className="qa-img qa-img-jz"></div>
                    <p className="qa-item-article">下图是决策平台登陆后主界面，左侧是模块菜单，有【模型】、【流程】、【任务】、【服务】四个模块，操作者根据业务需要点击相应模块即可进入相应版块中。</p>
                    <div className="qa-img qa-img-menu"></div>

                    <p className="qa-item-strong-sub-title">1.2 内部模块简介</p>
                    <p className="qa-item-strong-sub-sub-title">1.2.1 模型模块</p>
                    <p className="qa-item-article">统一管理、导入建模平台发布的本地模型，包含【模型列表】、【模型详情】、【模型添加】、【模型编辑】、【模型删除】等操作功能，详细操作方法请参考 产品操作手册-模型模块。</p>
                    <div className="qa-img qa-img-model"></div>

                    <p className="qa-item-strong-sub-sub-title">1.2.2 流程模块</p>
                    <p className="qa-item-article">管理由规则和模型组成的流程，其中包含【流程列表】、【添加流程】、流程【查看】、【继续编辑】、【删除】等操作功能，详细操作方法请参考 产品操作手册-流程模块。</p>
                    <div className="qa-img qa-img-process"></div>

                    <p className="qa-item-strong-sub-sub-title">1.2.3 任务模块</p>
                    <p className="qa-item-article">统一管理任务，其中包含【任务列表】、【添加任务】、【任务统计】、任务【查看】（进入任务详情页面包含【样本添加】，可添加数据进行决策）、【删除】等操作功能，详细操作方法请参考 产品操作手册-任务模块。</p>
                    <div className="qa-img qa-img-task"></div>

                    <p className="qa-item-strong-sub-sub-title">1.2.4 服务模块</p>
                    <p className="qa-item-article">统一管理生成的服务API，其中包含【服务列表】、【添加服务】、服务【查看】（进入服务详情页面包含【接口文档下载】）、【删除】等操作功能，详细操作方法请参考 产品操作手册-服务模块。</p>
                    <div className="qa-img qa-img-service"></div>




                    <p className="qa-item-strong-title">2. 产品操作手册</p>
                    <p className="qa-item-strong-sub-title">2.1 模型模块</p>
                    <p className="qa-item-article">统一管理、导入建模平台发布的本地模型</p>

                    <p className="qa-item-strong-sub-sub-title">2.1.1模型模块首页</p>
                    <p className="qa-item-article">a. 左侧是模型列表，包括【本地模型】（思维引擎发布的已添加至本地的模型），【已下线模型】（思维引擎中已下线的模型，不可再使用），可进行搜索筛选；</p>
                    <p className="qa-item-article">b. 右上角 【新增模型】（只能进行本地模型新增） 对模型进行【编辑】，【删除】；</p>
                    <p className="qa-item-article">c. 鼠标点击左侧模型名称，中部为模型的详细信息，包括【模型编码】、【名称】、【描述】、【类型】，下方为模型的【请求参数】和【返回参数】；</p>
                    <div className="qa-img qa-img-model2"></div>

                    <p className="qa-item-strong-sub-sub-title">2.1.2添加模型</p>
                    <p className="qa-item-article">a. 点击右上角【添加模型】按钮，添加思维引擎—预测平台已发布但未添加至决策平台的模型至本地模型列表；</p>
                    <div className="qa-img qa-img-model-add"></div>
                    <p className="qa-item-article">b. 点击【选择模型】框，可直接添加建模平台最新发布的模型（已添加至本地的模型不展示在待选列表中）；</p>
                    <div className="qa-img qa-img-model-choose"></div>
                    <div className="qa-img qa-img-model-choose2"></div>
                    <p className="qa-item-article">c. 选定模型后，选择框下方会显示模型详细信息，供业务方参考；</p>
                    <div className="qa-img qa-img-model-detail"></div>
                    <div className="qa-img qa-img-model-detail2"></div>

                    <p className="qa-item-article">d. 点击【下一步】进入模型信息确认页，有文本框的地方可直接补充内容；</p>
                    <div className="qa-img qa-img-model-info"></div>
                    <div className="qa-img qa-img-model-info2"></div>

                    <p className="qa-item-article">e. 进行【接口调试】，输入请求参数测试数据，点击【模型接口调试】，查看【返回结果】框内返回的结果是否与模型预期结果一致，若一致，点击【调试完毕，添加】，该模型将自动被添加至本地模型列表。若不一致，建议【返回继续调试】；</p>
                    <p className="qa-item-article">注意：模型调试结果正确与否不影响模型添加，但由于后续流程依赖于模型的准确性，建议确认调试结果无误后再选择添加模型。</p>
                    <div className="qa-img qa-img-model-adjust"></div>

                    <p className="qa-item-strong-sub-sub-title">2.1.3 模型编辑、删除</p>
                    <p className="qa-item-article">a. 点击【编辑】，可对模型进行编辑操作，进入模型编辑页；</p>
                    <div className="qa-img qa-img-model-edit"></div>
                    <p className="qa-item-article">有文本框的地方可直接编辑内容</p>
                    <div className="qa-img qa-img-model-edit2"></div>
                    <div className="qa-img qa-img-model-edit3"></div>

                    <p className="qa-item-article">b. 点击【删除】，删除时未添加在流程内的模型可以删除，在流程内添加的模型不能删除；</p>
                    <div className="qa-img qa-img-model-delete"></div>
                    <div className="qa-img qa-img-model-delete2"></div>

                    <p className="qa-item-strong-sub-title">2.2 流程模块</p>
                    <p className="qa-item-article">流程由模型和规则组成，模型是本地模型，规则有命中规则和分数规则。</p>

                    <p className="qa-item-strong-sub-sub-title">2.2.1流程模块首页</p>
                    <p className="qa-item-article">a. 中部是【流程列表】，包括【流程编码】、【类型】、【名称】、【创建时间】、【查看】，【继续编辑】，【删除】，可进行搜索筛选；</p>
                    <p className="qa-item-article">b. 右上角是 【新增流程】，可进行流程新增。</p>
                    <div className="qa-img qa-img-process-add"></div>

                    <p className="qa-item-strong-sub-sub-title">2.2.2流程新增</p>
                    <p className="qa-item-article">参考示例模型（示例流程中包含示例模型中对于命中规则和分数规则的添加操作）。 </p>
                    <div className="qa-img qa-img-process-add2"></div>
                    <p className="qa-item-article">在规则中的决策结果可选择【新建决策】，若命中此结果流程结束，会显示在报告中；</p>
                    <p className="qa-item-article">决策选项包括以下：</p>
                    <p className="qa-item-article">−【通过】：若命中此结果建议通过；</p>
                    <p className="qa-item-article">−【拒绝】：若命中此结果建议拒绝；</p>
                    <p className="qa-item-article">−【面审】：若命中此结果建议人工审核；</p>
                    <p className="qa-item-article">-【新建决策结果】：业务方根据自身业务需要自定义决策结果名称，在规则中的决策结果可选择【新建决策】；</p>
                    <p className="qa-item-article">−【分数无效】：针对返回的错误码，表明返回数字不适用于分数规则判断。</p>
                    <p className="qa-item-article">−【跳转至模型...】，命中某个子规则可选择增加新的模型继续判断。</p>
                    <p className="qa-item-article">− 若返回参数结果未命中流程中所有子规则，系统自动返回【中断】结果，建议配置人员返回查询中断原因。</p>
                    <p className="qa-item-article">若命中此结果流程结束，会显示在报告中；</p>
                    <p className="qa-item-article">以示例流程为例，进行流程新增规则配置演示：</p>
                    <p className="qa-item-article">a. 点击右上角 【添加流程】，跳转至流程新增页面</p>
                    <div className="qa-img qa-img-process-add3"></div>
                    <p className="qa-item-article">b. 右上角为流程添加进度，填写 【流程名称】、【类型】、【描述】，点击【下一步】，跳转至流程编辑页面，中部为流程编辑画布；</p>
                    <div className="qa-img qa-img-process-add4"></div>
                    <div className="qa-img qa-img-process-add5"></div>
                    <p className="qa-item-article">c. 点击【添加模型】（注意：一个流程中最多只能添加两个模型，如果流程中已添加超过两个模型，则无法再添加），选择决策过程中需要的模型</p>
                    <div className="qa-img qa-img-process-add6"></div>
                    <p className="qa-item-article">首次添加完成之后，会出现提示标签，点击【x】，或者【添加规则】，提示标签消失。对该模型标签可进行【查看】、【更换】、【删除】、【添加下一步规则】操作；</p>
                    <div className="qa-img qa-img-process-add7"></div>
                    <div className="qa-img qa-img-process-add8"></div>
                    <p className="qa-item-article">d. 点击【添加下一步规则】，选择【命中规则】，点击【参数选择】，选择参数作为衡量指标；</p>
                    <div className="qa-img qa-img-process-add9"></div>
                    <p className="qa-item-article">e. 弹出【选择参数】中包含字段，名称，类型和描述，添加【黑名单类型】命中规则，点击【确定】，以示例模型为例，示例模型中返回参数包括“A”、“B”、“C”、“D”四类（代表黑名单等级），接下来我们以示例模型中该类返回参数的类别进行命中规则的设置。</p>
                    <div className="qa-img qa-img-process-add10"></div>
                    <p className="qa-item-article">f. 选择规则【命中】填上【命中目标】（如针对命中黑名单类型结果为A或B的客群，直接拒绝），选择【拒绝】，点击【确定】；</p>
                    <p className="qa-item-article">（注意，在单个规则标签中，如果模型返回结果没有命中当前标签内的任一子规则，则流程模型继续前进，如设置规则：黑名单类型命中A和B，则拒绝；那么未命中A和B的样本继续进行下一个规则的判断。）</p>
                    <div className="qa-img qa-img-process-add11"></div>
                    <p className="qa-item-article">此时可对规则进行【编辑】、【删除】操作，左下角可【添加子规则】，点击【确定】返回流程编辑画布；</p>
                    <div className="qa-img qa-img-process-add12"></div>
                    <p className="qa-item-article">g. 点击【确定】返回流程编辑画布，点击【命中规则】标签，选择【添加下一步】，选择【规则】，点击【分数规则】，以示例模型中返回参数的分数参数为例，根据返回的分数数值进行分数规则的配置。</p>
                    <div className="qa-img qa-img-process-add13"></div>
                    <p className="qa-item-article">h. 点击【参数选择】，勾选【信用分PreA分数】规则，点击【确定】；</p>
                    <div className="qa-img qa-img-process-add14"></div>
                    <p className="qa-item-article">i. 填写【最大值】、【最小值】（如示例模型的返回分数参数在230-350之间，拒绝此用户，流程结束；若分数在无效范围内，为保证决策准确性，流程中断），选择【拒绝】，点击【确定】；</p>
                    <div className="qa-img qa-img-process-add15"></div>
                    <p className="qa-item-article">j. 此时可对规则进行【编辑】、【删除】操作，左下角可【添加子规则】；点击【确定】返回流程编辑画布；</p>
                    <div className="qa-img qa-img-process-add16"></div>
                    <p className="qa-item-article">k. 依次添加各个规则，流程添加完毕后，点击【完成】保存至流程列表后 不可编辑；未确定【完成】的流程，系统会自动保存，并在列表中显示继续编辑，可进行编辑操作。</p>
                    <div className="qa-img qa-img-process-add17"></div>
                    <div className="qa-img qa-img-process-add18"></div>

                    <p className="qa-item-strong-sub-sub-title">2.2.3 流程查看</p>
                    <p className="qa-item-article">a. 点击【查看】，跳转至流程详情页面，其中包括流程的【基本信息】和【流程框图】；</p>
                    <div className="qa-img qa-img-process-qry1"></div>
                    <div className="qa-img qa-img-process-qry2"></div>
                    <p className="qa-item-article">b. 点击流程框图中标签，可查看标签详情。</p>
                    <div className="qa-img qa-img-process-qry3"></div>
                    <div className="qa-img qa-img-process-qry4"></div>
                    <div className="qa-img qa-img-process-qry5"></div>
                    <div className="qa-img qa-img-process-qry6"></div>

                    <p className="qa-item-strong-sub-sub-title">2.2.4 流程编辑</p>
                    <p className="qa-item-article">a. 在流程列表页面操作框内点击【继续编辑】，进入流程编辑页面，可继续编辑流程；</p>
                    <div className="qa-img qa-img-process-edit1"></div>
                    <div className="qa-img qa-img-process-edit2"></div>
                    <p className="qa-item-article">b. 在流程列表页面操作框内点击【删除】；未应用在任务/服务中的流程 可删除，应用在任务/服务中的流程 不可删；</p>
                    <div className="qa-img qa-img-process-edit3"></div>
                    <div className="qa-img qa-img-process-edit4"></div>
                    <div className="qa-img qa-img-process-edit5"></div>
                    <div className="qa-img qa-img-process-edit6"></div>
                    <p className="qa-item-article">c. 在流程详情页面流程基本信息后，点击【编辑】，有文本框的地方可以编辑，编辑完成之后点击【提交】；</p>
                    <div className="qa-img qa-img-process-edit7"></div>
                    <div className="qa-img qa-img-process-edit8"></div>
                    <div className="qa-img qa-img-process-edit9"></div>

                    <p className="qa-item-strong-sub-title">2.3 任务模块</p>
                    <p className="qa-item-article">统一对任务进行管理，能够进行样本测试</p>
                    <p className="qa-item-strong-sub-sub-title">2.3.1任务模块首页</p>
                    <p className="qa-item-article">a. 中部是【任务列表】，包括【任务编码】、【任务名称】、【任务类型】、【创建时间】，可以对任务进行【编辑】，【删除】操作，可进行搜索筛选；</p>
                    <p className="qa-item-article">b. 右上角【任务统计】（点进去可查看任务统计列表）；【添加任务】可进行新任务添加；</p>
                    <div className="qa-img qa-img-task-index"></div>

                    <p className="qa-item-strong-sub-sub-title">2.3.2任务新增</p>
                    <p className="qa-item-article">a. 点击【添加任务】，跳转至新建任务页面；</p>
                    <div className="qa-img qa-img-task-add1"></div>
                    <p className="qa-item-article">b. 填写【任务名称】、【类型】、【描述】、【添加流程】（添加已保存在流程列表中的流程）；</p>
                    <div className="qa-img qa-img-task-add2"></div>
                    <p className="qa-item-article">c. 包含【流程编码】、【名称】、【类型】、【应用服务数】，在左侧单选框勾选流程，点击【确定】；</p>
                    <div className="qa-img qa-img-task-add3"></div>

                    <p className="qa-item-strong-sub-sub-title">2.3.3任务统计</p>
                    <p className="qa-item-article">a．点击【任务统计】进入任务统计页面；</p>
                    <div className="qa-img qa-img-task-sta1"></div>
                    <p className="qa-item-article">b．中部是任务列表，包括【日期】、【提交时间】、【任务编码】、【任务名称】、【请求样本量】、【统计详情】，可搜索筛选；</p>
                    <div className="qa-img qa-img-task-sta2"></div>
                    <p className="qa-item-article">c. 右上角有【对比】功能，可勾选两个任务点击对比，查看任务对比结果；</p>
                    <div className="qa-img qa-img-task-sta3"></div>
                    <p className="qa-item-article">包含两个任务的【饼图展示】（样本的中断、通过、拒绝比例）；可点击【查看统计详情】进入任务详情页面</p>
                    <div className="qa-img qa-img-task-sta4"></div>
                    <p className="qa-item-article">d. 点击【统计详情】，【饼图展示】是决策结果的统计比率区分，通过【饼图】可以迅速获取样本决策统计结果，如通过率和拒绝率；【任务日志】点击【查看报告】，可查看输出报告（决策平台给出的用户报告）。</p>
                    <div className="qa-img qa-img-task-sta5"></div>
                    <p className="qa-item-article">e. 报告样式</p>
                    <div className="qa-img qa-img-task-sta6"></div>

                    <p className="qa-item-strong-sub-sub-title">2.3.4 任务查看</p>
                    <p className="qa-item-article">a．点击操作框内【查看】，进入任务详情页；</p>
                    <div className="qa-img qa-img-task-qry1"></div>
                    <p className="qa-item-article">b．中部为【基本信息】、【任务流程】、【流程框图】（点击模型或规则标签可查看标签详情）；</p>
                    <p className="qa-item-article">c. 右上角可对任务进行【删除】、【编辑】、【添加样本】操作；</p>
                    <div className="qa-img qa-img-task-qry2"></div>

                    <p className="qa-item-strong-sub-sub-title">2.3.5添加样本</p>
                    <p className="qa-item-article">a. 点击右上角 【样本添加】，跳转至添加样本批量上传页面；</p>
                    <div className="qa-img qa-img-sample-add1"></div>
                    <p className="qa-item-article">b. 点击【模板下载】，下载excel模板，下载完毕后按要求填写上传数据格式</p>
                    <div className="qa-img qa-img-sample-add2"></div>
                    <p className="qa-item-article">c. 填写完毕之后，点击【数据上传】，提示数据上传成功【确定】，点击【完成】，样本上传完成。</p>
                    <div className="qa-img qa-img-sample-add3"></div>
                    <p className="qa-item-article">d. 稍后可返回【任务统计】页面，查看【任务详情】，根据文件大小时间需要几秒钟—几分钟不等。</p>

                    <p className="qa-item-strong-sub-sub-title">2.3.6 任务编辑</p>
                    <p className="qa-item-article">a. 在【任务详情】页面点击【编辑】，可进行基本信息编辑，点击【提交】即可更改；</p>
                    <div className="qa-img qa-img-task-edit1"></div>
                    <div className="qa-img qa-img-task-edit2"></div>
                    <p className="qa-item-article">b. 点击【删除】，进行二次确认，即可删除任务</p>
                    <div className="qa-img qa-img-task-edit3"></div>
                    <div className="qa-img qa-img-task-edit4"></div>

                    <p className="qa-item-strong-sub-title">2.4 服务模块</p>
                    <p className="qa-item-article">针对测试结果符合要求的流程，可生成服务API并无缝集成至自有系统中。并可对服务API进行统一管理。</p>
                    <p className="qa-item-strong-sub-sub-title">2.4.1 服务模块首页</p>
                    <p className="qa-item-article">a. 中部为服务列表，包含【服务编码】、【名称】、【类型】、【创建时间】、【最后调用时间】，可对其进行【查看】、【删除】操作；</p>
                    <p className="qa-item-article">b. 右上角【添加服务】，配置新服务api。</p>
                    <div className="qa-img qa-img-service-index"></div>

                    <p className="qa-item-strong-sub-sub-title">2.4.2 服务新增</p>
                    <p className="qa-item-article">a. 点击【添加服务】跳转至新增服务页面，填写服务基本信息、点击【添加流程】；</p>
                    <div className="qa-img qa-img-service-add1"></div>
                    <p className="qa-item-article">b. 流程选择列表，包含【流程编码】、【名称】、【类型】、【应用服务数】，在左侧单选框勾选流程，点击【确定】；</p>
                    <div className="qa-img qa-img-service-add2"></div>
                    <p className="qa-item-article">c. 若流程添加错误，可重新进行选择，配置完毕后，点击【保存并生成服务api】</p>
                    <div className="qa-img qa-img-service-add3"></div>

                    <p className="qa-item-strong-sub-sub-title">2.4.3 服务查看</p>
                    <p className="qa-item-article">a. 点击【查看】可进入服务详情页面，包含【基本信息】、【任务流程】、【流程框图】、【请求参数】、【返回参数】详情，按照要求填入参数信息进行【接口调试】；</p>
                    <p className="qa-item-article">−【请求参数】：流程中添加的模型需要输入的参数</p>
                    <p className="qa-item-article">−【返回参数】：流程最终判定结果</p>
                    <p className="qa-item-article">b. 右上角可进行【编辑】，【删除】，【下载接口文档】操作</p>
                    <div className="qa-img qa-img-service-qry1"></div>
                    <div className="qa-img qa-img-service-qry2"></div>
                    <div className="qa-img qa-img-service-qry3"></div>
                </div>
            </Crumb>
        );
    }
}
