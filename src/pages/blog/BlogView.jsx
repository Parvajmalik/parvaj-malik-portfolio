import React from 'react';
import { NorthEast } from '@mui/icons-material';
import '../../assets/css/Blog.css';

const BlogView = ({ blogPosts }) => {
  return (
    <div className="blog-page">
      <div className="blog-container">
        <div className="blog-header">
          <h1 className="blog-title">My Blog's</h1>
          <button className="see-all-btn">See All</button>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <div key={post.id} className="blog-card">
              <div className="blog-image-wrapper">
                <img src={post.image} alt={post.title} className="blog-image" />
                <button className="blog-arrow">
                  <NorthEast />
                </button>
              </div>
              <div className="blog-content">
                <span className="blog-category">{post.category}</span>
                <div className="blog-meta">
                  <span className="blog-author">{post.author}</span>
                  <span className="blog-date">{post.date}</span>
                </div>
                <h3 className="blog-post-title">{post.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogView;