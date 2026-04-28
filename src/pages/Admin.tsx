import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Github, CheckCircle2, FileJson, Image as ImageIcon } from 'lucide-react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const ADMIN_PASSWORD = 'Yuban18267';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert('密码错误');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 bg-slate-100 dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-200 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
              <Lock className="text-zinc-600 dark:text-zinc-400" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-8">管理后台登录</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">请输入管理员密码</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-zinc-100 text-zinc-900 font-bold rounded-xl hover:bg-white transition-colors"
            >
              进入后台
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pt-24 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="text-green-500" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">由于网络原因，管理方式已全新升级！</h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">完全免费、极速、无需数据库的 Git 内容管理方案</p>
            </div>
          </div>

          <div className="prose prose-invert prose-zinc max-w-none">
            <div className="bg-slate-100 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-8 rounded-3xl mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileJson className="text-blue-400" /> 为什么要这样改？
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                之前你遇到的 <strong>“图片一直显示处理中”</strong> 以及 <strong>“文字配置一刷新网页就没了”</strong> 的问题，是因为 Firebase 数据库的服务器被国内网络屏障（GFW）阻挡，导致你的浏览器无法成功将数据发送给 Google 的服务器。
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                为了彻底解决这个问题，并且让你更方便地管理（比如直接使用 GitHub 管理），我帮你去掉了所有复杂的数据库，把网站改造成了 <strong>“Git-based CMS (基于 Git 的静态内容管理)”</strong>。
                <br /><br />
                这意味着：你的所有博客、联系方式、图片数据，现在都变成了纯文本的 JSON 文件，直接保存在你的代码仓库里。<strong>Vercel 每次检测到你修改了这些文件，就会自动重新部署一次！</strong> 速度不仅极快，并且国内访问永远不会卡数据库。
              </p>
            </div>

            <div className="bg-slate-100 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-8 rounded-3xl mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Github className="text-zinc-700 dark:text-zinc-300" /> 如何发布新内容 / 修改联系方式？
              </h3>
              <ol className="list-decimal pl-5 space-y-4 text-zinc-600 dark:text-zinc-400">
                <li>打开你的 GitHub 仓库：<code>Yuban18267/-Web</code></li>
                <li>找到并进入 <strong><code>src/data</code></strong> 文件夹。你会看到以下几个文件：
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li><code className="text-sky-400 bg-sky-400/10 px-1 rounded">contacts.json</code> - 管理联系我页面的邮箱、微信、QQ、B站、抖音、小红书等</li>
                    <li><code className="text-sky-400 bg-sky-400/10 px-1 rounded">blogs.json</code> - 管理文字博客（支持多图并排）</li>
                    <li><code className="text-sky-400 bg-sky-400/10 px-1 rounded">games.json</code> - 管理游戏生涯</li>
                    <li><code className="text-sky-400 bg-sky-400/10 px-1 rounded">photos.json</code> - 管理摄影图片</li>
                    <li><code className="text-sky-400 bg-sky-400/10 px-1 rounded">videos.json</code> - 管理视频</li>
                  </ul>
                </li>
                <li><strong>点击你想修改的文件</strong>（比如 <code>blogs.json</code>），点击右上角的 ✏️ (铅笔图标) 编辑文件。</li>
                <li>按照里面的 JSON 格式，复制一段 <code>{"{...}"}</code>，修改成你的内容。注意图文结合的使用方法：
                  <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl mt-2 text-xs font-mono overflow-auto border border-slate-200 dark:border-zinc-800">
{`[
  {
    "id": "2", // 每次新增一个，把 id 改成不一样的数字
    "title": "今天去看了海",
    "category": "随笔",
    "content": "天气很好，拍了几张照片和大家分享。这几张照片很不错哦！",
    "createdAt": "2024-04-14T10:00:00.000Z",
    "images": [
      "https://raw.githubusercontent.com/Yuban18267/-Web/main/public/images/sea-1.jpg",
      "https://raw.githubusercontent.com/Yuban18267/-Web/main/public/images/sea-2.jpg"
    ] // 如果没有图片，请直接删掉 "images" 这行。可以放一张或多张图片，页面会自动排版。
  }
]`}
                  </div>
                </li>
                <li>改完后，点击页面右上角的绿色的 <strong>Commit changes</strong> 按钮保存。</li>
                <li>Vercel 会自动拉取这些更新，大概等一两分钟，你的线上网站就会自动更新了！</li>
              </ol>
            </div>

            <div className="bg-slate-100 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ImageIcon className="text-purple-400" /> 如何上传图片？
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                同样使用 GitHub 管理即可，完全免费且和代码绑在一起：
              </p>
              <ol className="list-decimal pl-5 space-y-4 text-zinc-600 dark:text-zinc-400">
                <li>在你的 GitHub 仓库（<code>main</code> 页面），找到 <code>public/images</code> 文件夹。
                  <div className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30 mt-2">
                    💡 <strong>如果需要在 GitHub 上手动创建新文件夹（例如你想新建 <code>public/covers</code>）：</strong><br />
                    点击 <strong>Add file -&gt; Create new file</strong>，在输入文件名的框里输入 <code>public/covers/</code>（注意最后的斜杠 <code>/</code>）。输入斜杠后，GitHub 会自动把它变成一个文件夹！然后随便写个文件名比如 <code>.keep</code>，提交即可生效。
                  </div>
                </li>
                <li>进入你想要的文件夹后，点击左上角的 <strong>Add file -&gt; Upload files</strong> 把你的图片传上去（比如 <code>my-photo.jpg</code>）。</li>
                <li>在 JSON 文件中（如 <code>photos.json</code>），将图片的 <code>url</code> 字段写成这样：
                  <br/>
                  <code className="text-sky-400 bg-sky-400/10 px-2 py-1 rounded inline-block mt-2 break-all">/images/你的图片名.jpg</code>
                  <div className="text-sm text-zinc-500 mt-2">
                    系统内置了优化功能，你现在不再需要填写一长串 Github 连接，直接写相对路径 <code>/images/图片.jpg</code> 或从 GitHub 复制的 URL 都可以，系统会自动处理并加速国内访问！
                  </div>
                </li>
              </ol>
            </div>
            
          </div>
        </motion.div>
      </div>
    </div>
  );
}
