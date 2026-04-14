import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Upload, Plus, Trash2, LogOut, Image as ImageIcon, Video, FileText, Gamepad2, Phone } from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'blogs' | 'games' | 'contacts'>('photos');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  // Form states
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('随笔');
  const [file, setFile] = useState<File | null>(null);

  // Contact form states
  const [contactInfo, setContactInfo] = useState({
    twitter: '',
    github: '',
    email: '',
    qq: '',
    wechat: ''
  });

  const ADMIN_PASSWORD = 'yuban18267';

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_auth');
    if (authStatus === 'true') setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchItems();
    }
  }, [isAuthorized, activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      if (activeTab === 'contacts') {
        const docRef = doc(db, 'contacts', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContactInfo(docSnap.data() as any);
        }
      } else {
        const q = query(collection(db, activeTab), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('密码错误');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.removeItem('admin_auth');
  };

  const handleFileUpload = async () => {
    if (!file) return null;
    const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'contacts') {
        await setDoc(doc(db, 'contacts', 'main'), contactInfo);
        alert('联系方式保存成功！');
      } else {
        let finalUrl = url;
        if (file) {
          const uploadedUrl = await handleFileUpload();
          if (uploadedUrl) finalUrl = uploadedUrl;
        }

        const data: any = {
          title,
          createdAt: new Date().toISOString(),
        };

        if (activeTab === 'photos') {
          data.url = finalUrl;
        } else if (activeTab === 'videos') {
          data.url = finalUrl; // thumbnail
          data.videoUrl = videoUrl;
          data.duration = "5:00"; // Default
        } else if (activeTab === 'blogs') {
          data.content = content;
          data.category = category;
        } else if (activeTab === 'games') {
          data.url = finalUrl;
          data.content = content;
        }

        await addDoc(collection(db, activeTab), data);
        alert('发布成功！');
        // Reset form
        setTitle(''); setUrl(''); setVideoUrl(''); setContent(''); setFile(null);
        fetchItems();
      }
    } catch (error) {
      console.error("Error adding document:", error);
      alert('操作失败');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除吗？')) return;
    try {
      await deleteDoc(doc(db, activeTab, id));
      fetchItems();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center">
              <Lock className="text-zinc-400" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-zinc-100 mb-8">管理后台登录</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">请输入管理员密码</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all"
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
    <div className="min-h-screen bg-zinc-950 pt-24 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">内容管理后台</h1>
            <p className="text-zinc-500 mt-2">欢迎回来，拾壹屿。在这里管理你的所有作品。</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg hover:text-zinc-100 transition-colors"
          >
            <LogOut size={18} /> 退出登录
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          <TabButton active={activeTab === 'photos'} onClick={() => setActiveTab('photos')} icon={<ImageIcon size={18} />} label="摄影作品" />
          <TabButton active={activeTab === 'videos'} onClick={() => setActiveTab('videos')} icon={<Video size={18} />} label="视频记录" />
          <TabButton active={activeTab === 'blogs'} onClick={() => setActiveTab('blogs')} icon={<FileText size={18} />} label="文字博客" />
          <TabButton active={activeTab === 'games'} onClick={() => setActiveTab('games')} icon={<Gamepad2 size={18} />} label="游戏生涯" />
          <TabButton active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} icon={<Phone size={18} />} label="联系方式" />
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800 sticky top-24">
              <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
                <Plus size={20} /> {activeTab === 'contacts' ? '编辑联系方式' : '发布新内容'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {activeTab !== 'contacts' && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">标题</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-500"
                      placeholder="输入标题..."
                      required
                    />
                  </div>
                )}

                {activeTab !== 'blogs' && activeTab !== 'contacts' && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">图片/封面上传</label>
                    <div className="relative group">
                      <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept="image/*"
                      />
                      <div className="w-full px-4 py-8 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center group-hover:border-zinc-600 transition-colors">
                        <Upload className="text-zinc-600 mb-2" size={24} />
                        <span className="text-sm text-zinc-500">{file ? file.name : '点击或拖拽上传图片'}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-xs text-zinc-600">或者输入外部链接:</span>
                      <input 
                        type="text" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full mt-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 text-sm"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'videos' && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">视频链接 (Bilibili/YouTube)</label>
                    <input 
                      type="text" 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-500"
                      placeholder="https://..."
                      required
                    />
                  </div>
                )}

                {activeTab === 'blogs' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">分类</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none"
                      >
                        <option>随笔</option>
                        <option>摄影心得</option>
                        <option>旅行日记</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">正文内容</label>
                      <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-500 min-h-[200px]"
                        placeholder="开始写作..."
                        required
                      />
                    </div>
                  </>
                )}

                {activeTab === 'games' && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">心得/描述</label>
                    <textarea 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-500 min-h-[150px]"
                      placeholder="记录你的游戏瞬间..."
                      required
                    />
                  </div>
                )}

                {activeTab === 'contacts' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Email</label>
                      <input 
                        type="email" 
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-500"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">GitHub 链接</label>
                      <input 
                        type="url" 
                        value={contactInfo.github}
                        onChange={(e) => setContactInfo({...contactInfo, github: e.target.value})}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-500"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Twitter 链接</label>
                      <input 
                        type="url" 
                        value={contactInfo.twitter}
                        onChange={(e) => setContactInfo({...contactInfo, twitter: e.target.value})}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-500"
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">WeChat (微信号)</label>
                      <input 
                        type="text" 
                        value={contactInfo.wechat}
                        onChange={(e) => setContactInfo({...contactInfo, wechat: e.target.value})}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-500"
                        placeholder="微信号"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">QQ 号</label>
                      <input 
                        type="text" 
                        value={contactInfo.qq}
                        onChange={(e) => setContactInfo({...contactInfo, qq: e.target.value})}
                        className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-500"
                        placeholder="QQ号"
                      />
                    </div>
                  </>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-zinc-100 text-zinc-900 font-bold rounded-xl hover:bg-white transition-colors disabled:opacity-50"
                >
                  {loading ? '处理中...' : (activeTab === 'contacts' ? '保存联系方式' : '确认发布')}
                </button>
              </form>
            </div>
          </div>

          {/* List Column */}
          {activeTab !== 'contacts' && (
            <div className="lg:col-span-2">
              <div className="space-y-4">
              {loading && items.length === 0 ? (
                <div className="text-center py-20 text-zinc-500">加载中...</div>
              ) : items.length === 0 ? (
                <div className="text-center py-20 text-zinc-500 bg-zinc-900/30 rounded-3xl border border-zinc-800">
                  暂无内容，快去发布一个吧！
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      {activeTab !== 'blogs' && (
                        <img src={item.url} className="w-16 h-16 rounded-lg object-cover bg-zinc-800" referrerPolicy="no-referrer" />
                      )}
                      <div>
                        <h3 className="font-bold text-zinc-200">{item.title}</h3>
                        <p className="text-xs text-zinc-500 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${active ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800'}`}
    >
      {icon} {label}
    </button>
  );
}
