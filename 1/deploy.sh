#!/bin/bash
#author yangxiaoxu@baidu.com

#提示用户做出选择
showMenu() {
cat << EOF
----------------------------
请做输入对应数字对应选择：
    1: 执行 (编译开发环境)
    2: 执行 (编译测试环境)
    3: 执行 (编译线上环境)
    0: quit
----------------------------
EOF
}

#执行代码编译
release(){
    chmod 755 release.sh
    ./release.sh
    # # 文件名
    # FILE_NAME="decision-platform_$1.tar.gz"
    # rm -rf output/
    # npm run build-$1

    # cd output
    # tar -zcvf ${FILE_NAME} ./assets ./template
    # rm -rf ./assets
    # rm -rf ./template
    # echo "build end"
}

main()
{
    showMenu
    while read -p "Plese input number : " opt;
    do
        case $opt in
            1) echo "开始编译开发环境代码，请稍等！"
               release rd;
               exit 0;;
            2) echo "开始编译线测试环境代码，请稍等！"
               release qa;
               exit 0;;
            3) echo "开始编译线上环境代码，请稍等！"
               release prod;
               exit 0;;
            0) exit 0;;
            *) echo "please in put number 0-3"
               showMenu
        esac
    done
}
#start entry
main


