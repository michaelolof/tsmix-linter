ts-node update-version.ts $1 "../package.json" 
git-commit.sh $2
git push origin master
npm publish