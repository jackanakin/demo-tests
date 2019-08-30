#Git commit
##Add files to commit
    git add . #Add all files to commit
##List git status
    git status
##Commit version
    git commit -m "fix: ...."
    git commit -m "feature: ...."
    git commit -m "chore: ..."
##Push to master
    git push -u origin master
    git push #Shortcut to master
##Create another branch
    git checkout -b chore/node-test #create new branch
    git checkout master #return to master branch
    git push origin chore/node-test #push branch to remote