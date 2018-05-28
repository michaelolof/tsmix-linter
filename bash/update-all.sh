# update-npm-version.sh $1 "../package.json" 
tsc
git-commit.sh $2
git push origin master
npm publish