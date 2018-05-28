update-npm-version.sh $1 "C:/Users/Michael/Desktop/M.O.O/Programs/custom-npm-modules/tsmix-linter/package.json" 
git-commit.sh $2
git push origin master
npm publish