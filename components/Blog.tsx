import React, { useRef } from 'react';
import { BLOG_POSTS } from '../constants';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const BlogCard: React.FC<{ post: typeof BLOG_POSTS[0]; index: number }> = ({ post, index }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-white/5 isolate">
        {/* Parallax Container */}
        <motion.div 
            style={{ y }} 
            className="absolute inset-0 w-full h-[120%] -top-[10%]"
        >
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </motion.div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
      </div>
      
      <div className="flex items-center gap-3 mb-3 text-xs font-mono text-gray-500 uppercase tracking-wider">
        <span>{post.date}</span>
        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
        <span>{post.readTime}</span>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors leading-tight">
        {post.title}
      </h3>
      
      <div className="text-gray-400 line-clamp-2 mb-4">
        <ReactMarkdown
          disallowedElements={['p']}
          unwrapDisallowed
          components={{
            a: ({node, ...props}) => (
              <a 
                {...props} 
                className="text-purple-400 hover:text-purple-300 transition-colors hover:underline"
                onClick={(e) => {
                  // Ensure smooth scrolling for hash links if they exist
                  const href = props.href;
                  if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const element = document.querySelector(href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              />
            )
          }}
        >
          {post.excerpt}
        </ReactMarkdown>
      </div>
      
      <div className="mt-auto flex items-center text-sm font-bold text-white group-hover:underline decoration-purple-500 underline-offset-4">
        Read Article
      </div>
    </motion.article>
  );
};

const Blog: React.FC = () => {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
           <motion.h2 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="text-4xl md:text-5xl font-bold text-white tracking-tight"
           >
             EXPLORE <span className="text-gray-600">MY BLOG</span>
           </motion.h2>
           <a href="#" className="hidden md:flex items-center gap-2 text-white hover:text-purple-400 transition-colors font-medium">
             View All Articles <ArrowRight size={16} />
           </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;