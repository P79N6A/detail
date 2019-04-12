#!/bin/bash
#MOD_NAME="decision-platform"
#TAR="$MOD_NAME.tar.gz"
# add path
#fis build.sh sample dy
# export PATH=/home/fis/node/v6/bin:/home/fis/v6/npm/bin:/home/fis/npm/bin:$PATH
# npm i --registry http://pnpm.baidu.com
# 文件名
FILE_NAME="decision-platform.tar.gz"
rm -rf output/
npm run build
cd output
tar -zcvf ${FILE_NAME} ./assets ./template
rm -rf ./assets
rm -rf ./template
echo "build end"