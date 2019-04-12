rm -rf output
echo "install node"
# 设置 node.js 环境
export PATH=/home/scmtools/buildkit/node/node_8.10.0/bin:$PATH
node -v
mkdir -p output
# 使用 内部源 安装依赖包
echo "npm install"
npm install --registry=http://registry.npm.baidu-int.com
if [ $? != 0 ]; then
  exit 1
fi
sh release.sh
cd dist
mv fdi-console-fe.tar.gz ../output
cd ..
rm -rf dist
echo "build done"