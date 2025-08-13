# feature branch名を切り出す（例えば feature123/main → feature123）
FEATURE_BRANCH_SHORT=$(echo "${GITHUB_REF#refs/heads/}" | cut -d'/' -f1)

# 対象ファイルの一覧を取得（featureブランチの全ファイル）
git fetch origin "$FEATURE_BRANCH_SHORT"
FILES=$(git ls-tree -r --name-only origin/"$FEATURE_BRANCH_SHORT")

# 拡張子ごとにカウント
declare -A ext_counts
for file in $FILES; do
  ext="${file##*.}"
  # ファイル名に拡張子がない場合はスキップ
  if [[ "$file" == *.* ]]; then
    ((ext_counts[$ext]++))
  fi
done

# 最も多い拡張子を見つける
max_ext=""
max_count=0
for ext in "${!ext_counts[@]}"; do
  if (( ext_counts[$ext] > max_count )); then
    max_ext=$ext
    max_count=${ext_counts[$ext]}
  fi
done

# 作成するディレクトリ名
target_dir="${FEATURE_BRANCH_SHORT}_${max_ext}"

# ディレクトリ作成
mkdir -p "$target_dir"

echo "Created directory: $target_dir based on feature branch and extension counts"
