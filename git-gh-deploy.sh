#!/bin/sh
if [ -z "$1" ]
then
  deploy_folder="dist"
else
  deploy_folder=$1
fi

echo "Deploying $deploy_folder folder to GitHub Pages"

git push origin `git subtree split --prefix $deploy_folder master`:gh-pages --force
