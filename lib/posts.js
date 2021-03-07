import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

// ディレクトリパス取得
const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  // /posts配下のファイル名を取得
  const fileNames = fs.readdirSync(postsDirectory);
  //
  const allPostsData = fileNames.map((fileName) => {
    // ファイル名から.mdを削除した名前をIDとして取得
    const id = fileName.replace(/\.md$/, "");
    // MDファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    // 投稿のメタデータ部分を解析
    const matterResult = matter(fileContents);
    return {
      id,
      ...matterResult.data,
    };
  });

  // 投稿を日付でソート
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    }
    return -1;
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const filePath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  // 投稿のメタデータ部分を解析
  const matterResult = matter(fileContents);
  // マークダウンをHTML文字に変換
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
