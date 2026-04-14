import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Twitter, Github, Mail, MessageCircle, MessageSquare } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Contact() {
  const [contactInfo, setContactInfo] = useState({
    twitter: '',
    github: '',
    email: '',
    qq: '',
    wechat: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const docRef = doc(db, 'contacts', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContactInfo(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
      setLoading(false);
    };
    fetchContactInfo();
  }, []);

  const contactMethods = [
    {
      id: 'email',
      icon: <Mail size={32} />,
      label: 'Email',
      value: contactInfo.email || '未设置',
      href: contactInfo.email ? `mailto:${contactInfo.email}` : '#',
      color: 'hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-400/10'
    },
    {
      id: 'github',
      icon: <Github size={32} />,
      label: 'GitHub',
      value: contactInfo.github || '未设置',
      href: contactInfo.github || '#',
      color: 'hover:text-zinc-100 hover:border-zinc-100/50 hover:bg-zinc-100/10'
    },
    {
      id: 'twitter',
      icon: <Twitter size={32} />,
      label: 'Twitter',
      value: contactInfo.twitter || '未设置',
      href: contactInfo.twitter || '#',
      color: 'hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-400/10'
    },
    {
      id: 'wechat',
      icon: <MessageCircle size={32} />,
      label: 'WeChat',
      value: contactInfo.wechat || '未设置',
      href: '#',
      color: 'hover:text-green-500 hover:border-green-500/50 hover:bg-green-500/10',
      copyable: true
    },
    {
      id: 'qq',
      icon: <MessageSquare size={32} />,
      label: 'QQ',
      value: contactInfo.qq || '未设置',
      href: '#',
      color: 'hover:text-blue-500 hover:border-blue-500/50 hover:bg-blue-500/10',
      copyable: true
    }
  ];

  const handleCopy = (text: string) => {
    if (text && text !== '未设置') {
      navigator.clipboard.writeText(text);
      alert('已复制到剪贴板: ' + text);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">联系我</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
          欢迎通过以下方式与我取得联系，无论是交流技术、分享生活还是合作意向。
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500">加载中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {method.copyable ? (
                <div 
                  onClick={() => handleCopy(method.value)}
                  className={`flex flex-col items-center justify-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl transition-all duration-300 cursor-pointer group ${method.color}`}
                >
                  <div className="text-zinc-500 mb-4 transition-colors duration-300 group-hover:text-inherit">
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100 mb-2">{method.label}</h3>
                  <p className="text-sm text-zinc-400 text-center break-all">{method.value}</p>
                  <p className="text-xs text-zinc-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">点击复制</p>
                </div>
              ) : (
                <a 
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl transition-all duration-300 group ${method.color}`}
                >
                  <div className="text-zinc-500 mb-4 transition-colors duration-300 group-hover:text-inherit">
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100 mb-2">{method.label}</h3>
                  <p className="text-sm text-zinc-400 text-center break-all">{method.value}</p>
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
