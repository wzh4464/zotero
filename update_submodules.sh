#!/bin/bash

# 检查当前目录是否是一个 Git 仓库
if [ ! -d ".git" ]; then
  echo "当前目录不是一个 Git 仓库。"
  exit 1
fi

# 获取当前分支名称
current_branch=$(git rev-parse --abbrev-ref HEAD)

# 拉取主仓库的最新更改
echo "正在拉取主仓库的最新更改..."
git pull origin $current_branch

# 查找所有子模块的 .git 目录
echo "正在查找所有子模块的 .git 目录..., recursively"
submodule_dirs=$(find . -name ".git" )

echo "找到以下子模块："
echo "$submodule_dirs"

for submodule_git_dir in $submodule_dirs; do
  submodule_dir=$(dirname "$submodule_git_dir")
  echo "进入子模块目录 $submodule_dir..."
  cd "$submodule_dir"

  # 获取子模块的当前分支
  submodule_branch=$(git rev-parse --abbrev-ref HEAD)
  if [ "$submodule_branch" = "HEAD" ]; then
    echo "子模块 $submodule_dir 处于分离头指针状态，跳过..."
  else
    echo "正在拉取子模块 $submodule_dir 的最新更改..."
    git pull

    # 检查是否有 upstream 远程仓库
    if git remote | grep -q upstream; then
      # 合并 upstream/main 到当前分支
      echo "正在合并 upstream/main 到 $submodule_branch..."
      git fetch upstream
      git merge upstream/main
    else
      echo "子模块 $submodule_dir 没有 upstream 远程仓库，跳过合并..."
    fi
  fi

  cd - > /dev/null
done

# 合并 upstream/main 到当前分支
echo "正在合并主仓库的 upstream/main 到 $current_branch..."
git fetch upstream
# git merge upstream/main
# merge without interaction, commit message will be auto generated
git merge upstream/main --no-edit

echo "所有操作完成。"

