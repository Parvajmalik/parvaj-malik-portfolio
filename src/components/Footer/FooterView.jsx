import { Link } from "react-router-dom";
import { usePortfolio } from "../../context/PortfolioContext";

const FooterView = () => {
  const data = usePortfolio();
  if (!data) return null;

  const { site, footer } = data;
  return (
    <footer className="bg-dark-custom text-white">
      <div className="container py-5">

        {/* CTA row */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <h2 className="fw-semibold mb-0 cta-heading">{footer.ctaText}</h2>
          <a
            href={footer.hireMeLink}
            className="btn rounded-pill d-flex align-items-center gap-2 px-4 py-2 fw-semibold btn-orange"
          >
            Hire me <i className="bi bi-arrow-up-right" />
          </a>
        </div>

        <hr className="footer-hr" />

        {/* Main footer grid */}
        <div className="row g-5 py-4">

          {/* Brand */}
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold footer-logo">
                {site.initials}
              </div>
              <span className="fw-semibold fs-5">{site.name.toUpperCase()}</span>
            </div>
            <p className="text-white-50 mb-3 footer-bio">{footer.bio}</p>
            <div className="d-flex gap-3">
              {footer.social.map(({ icon, href }) => (
                <a key={icon} href={href} className="text-white-50 fs-5 text-decoration-none social-link">
                  <i className={`bi ${icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="col-lg-2 col-6">
            <h5 className="fw-semibold mb-3 footer-section-title">Navigation</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {footer.navLinks.map(item => (
                <li key={item}>
                  <Link to="#" className="text-white-50 text-decoration-none footer-nav-link">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-6">
            <h5 className="fw-semibold mb-3 footer-section-title">Contact</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0 text-white-50">
              <li>{footer.contact.phone}</li>
              <li>{footer.contact.email}</li>
              <li>{footer.contact.website}</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3">
            <h5 className="fw-semibold mb-3 footer-section-title">{footer.newsletterTitle}</h5>
            <div className="input-group">
              <input
                type="email"
                className="form-control newsletter-input"
                placeholder="Email Address"
              />
              <button className="btn btn-orange border-0">
                <i className="bi bi-send-fill" />
              </button>
            </div>
          </div>

        </div>

        <hr className="footer-hr" />

        <p className="text-center text-white-50 mb-0 small">{site.copyright}</p>

      </div>
    </footer>
  );
};

export default FooterView;