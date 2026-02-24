import { usePortfolio } from "../../context/PortfolioContext";

const BlogView = () => {
  const data = usePortfolio();
  if (!data) return null;

  const { blogs } = data;

  return (
    <div className="container py-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="fw-bold mb-0 text-orange section-heading">My Blogs</h1>
        <button className="btn rounded-pill px-4 py-2 fw-semibold btn-orange">
          See All
        </button>
      </div>

      {/* Grid */}
      <div className="row g-4">
        {blogs.map(blog => (
          <div className="col-md-4" key={blog.id}>
            <div className="card border-0 rounded-4 overflow-hidden h-100 blog-card">

              {/* Image */}
              <div className="position-relative overflow-hidden">
                <img src={blog.image} alt={blog.title} className="blog-img" />
                <button className="btn rounded-circle d-flex align-items-center justify-content-center position-absolute btn-circle">
                  <i className="bi bi-arrow-up-right" />
                </button>
              </div>

              {/* Body */}
              <div className="card-body p-3">
                <span className="badge rounded-pill px-3 py-2 mb-3 fw-medium blog-badge">
                  {blog.category}
                </span>

                <div className="d-flex gap-3 mb-2 small text-secondary">
                  <span><span className="text-orange">● </span>{blog.author}</span>
                  <span><span className="text-orange">● </span>{blog.date}</span>
                </div>

                <h5 className="fw-semibold mb-0 text-dark-custom" style={{ lineHeight: 1.4 }}>
                  {blog.title}
                </h5>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default BlogView;