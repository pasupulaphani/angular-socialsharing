#!/bin/sh
if [ -z "$1" ]
then
  deploy_folder=$1
else
  deploy_folder="dist"
fi

echo "Deploying $1 folder to GitHub Pages"

git subtree push --prefix $1 origin gh-pages
