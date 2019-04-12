#!/bin/bash
echo "execute webpack packing......"
npm run build
if [ $? != 0 ]; then
  exit 1
fi
echo "webpack done ! "
cd dist
tar -czvf infinite.tar.gz ./assets ./template
rm -rf ./assets ./template
cd ..
echo "build to dist done ! "