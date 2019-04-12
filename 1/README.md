# decision-platform

决策平台前端

## 技术

 react + webpack 

## 命令介绍

* npm run dev 开发编译调试
 > http://localhost:8008
 
* npm start 执行
* 代码编译 
  rd环境产出： sh release.sh rd
  qa环境产出： sh release.sh qa
  生产环境产出： sh release.sh prod
* 提交icode  git push origin HEAD:refs/for/master   or git push origin HEAD:refs/for/$branchName