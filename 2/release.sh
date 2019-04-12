#!/bin/bash
echo "execute webpack packing......"
npm run build
if [ $? != 0 ]; then
  exit 1
fi
echo "webpack done ! "

cd dist
mkdir -p static
cd static
wget -O output.tar.gz --header "IREPO-TOKEN:16fa142c-79d8-440f-a6b6-521b79da1e4f" "https://irepo.baidu-int.com/rest/prod/v3/baidu/acu-fin-fe/logout/releases/1.0.1.1/files"
tar zxvf output.tar.gz
mv output/logout.tar.gz ./
tar zxvf logout.tar.gz
rm -rf ./logout.tar.gz ./*.md5 output ./output.tar.gz
cd ..
mv static ./assets
tar -czvf fdi-console-fe.tar.gz ./assets ./template
rm -rf ./assets ./template
cd ..
echo "build to dist done ! "
