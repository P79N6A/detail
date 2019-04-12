/**
 * @file 设置页面状态（卸载状态下解除setState）
 * @author
 * ---------------------------------------
 */

export default function (data, callback) {
    this.state.isMounting && this.setState(data, callback);
}
