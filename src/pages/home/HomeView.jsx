import { usePortfolio } from "../../context/PortfolioContext";

const HomeView = () => {
  const data = usePortfolio();
  if (!data) return null;

  const { hero, about, workExperience } = data;
  return (
    <div>
      {/* ── HERO ── */}
      <section className="bg-white pt-5">
        <div className="container">
          {/* Hello bubble */}
          <div className="text-center mb-3">
            <span className="rounded-pill px-4 py-2 fw-medium fs-5 position-relative d-inline-block hello-badge">
              {hero.greeting}
              <svg
                width="28"
                height="28"
                className="squiggle-top"
                viewBox="0 0 32 33"
                fill="none"
              >
                <path
                  d="M2.00055 20.0005C2.00055 17.0005 5.00055 11.0005 2.00055 2.00054M9.50055 23.5005C13.8339 19.3339 22.7005 9.20054 23.5005 2.00054M12.5005 30.5005C15.1672 30.5005 22.3005 29.1005 29.5005 23.5005"
                  stroke="#FEB273"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {/* Headline */}
          <div className="text-center position-relative mb-5">
            <h1 className="display-3 fw-bold text-dark-custom">
              I'm <span className="text-orange">{hero.firstName}</span>,<br />
              {hero.role}
            </h1>
            <svg
              width="55"
              height="65"
              className="squiggle-headline"
              viewBox="0 0 74 85"
              fill="none"
            >
              <path
                d="M70.7544 35.9953C69.0721 43.6553 58.0474 57.293 60.6604 81.9553M53.5672 22.8528C40.1662 31.0616 11.8441 51.9631 5.7638 69.8985M49.8327 3.29717C43.0238 1.80175 24.0249 1.37619 2.50059 11.6372"
                stroke="#FEB273"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Three columns */}
          <div className="row g-2 mt-2">
            {/* Testimonial */}
            <div className="col-lg-3 col-12 d-flex justify-content-lg-end justify-content-center">
              <div className="testimonial-wrap">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  className="mb-2"
                >
                  <path
                    d="M12.135 17.445H5.1C5.22 10.44 6.6 9.285 10.905 6.735C11.4 6.435 11.565 5.805 11.265 5.295C10.98 4.8 10.335 4.635 9.84 4.935C4.77 7.935 3 9.765 3 18.48V26.565C3 29.13 5.085 31.2 7.635 31.2H12.135C14.775 31.2 16.77 29.205 16.77 26.565V22.065C16.77 19.44 14.775 17.445 12.135 17.445Z"
                    fill="#344054"
                  />
                  <path
                    d="M28.365 17.445H21.33C21.45 10.44 22.83 9.285 27.135 6.735C27.63 6.435 27.795 5.805 27.495 5.295C27.195 4.8 26.565 4.635 26.055 4.935C20.985 7.935 19.215 9.765 19.215 18.495V26.58C19.215 29.145 21.3 31.215 23.85 31.215H28.35C30.99 31.215 32.985 29.22 32.985 26.58V22.08C33 19.44 31.005 17.445 28.365 17.445Z"
                    fill="#344054"
                  />
                </svg>
                <p className="fw-medium mb-0 testimonial-text">
                  {hero.testimonial}
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="col-lg-6 col-12 d-flex justify-content-center">
              <div className="hero-avatar">
                <img src={hero.profileImage} alt={hero.firstName} />
              </div>
            </div>

            {/* Stars + Years */}
            <div className="col-lg-3 col-12 d-flex justify-content-lg-start justify-content-center">
              <div>
                <div className="d-flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill star-icon" />
                  ))}
                </div>
                <strong className="d-block fw-bold years-count">
                  {hero.yearsExperience} Years
                </strong>
                <span className="text-secondary">Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-5 about-section">
        <div className="container">
          <div className="d-flex justify-content-between">
            <h2 className="fw-bold text-white mb-2 section-heading">
              About <span className="text-orange">Me</span>
            </h2>
            <p className="text-white mb-5 about-desc">{about.description}</p>
          </div>
          <div className="row g-4">
            {about.skills.map((s, i) => (
              <div className="col-md-4" key={i}>
                <div className="rounded-4 p-3 h-100 position-relative about-card">
                  <h3 className="text-white fw-semibold mb-3 skill-title">
                    {s.title}
                  </h3>
                  <div className="rounded-3 overflow-hidden mb-3">
                    <img src={s.image} alt={s.title} className="about-img" />
                  </div>
                  <button className="btn rounded-circle d-flex align-items-center justify-content-center position-absolute btn-circle">
                    <i className="bi bi-arrow-up-right" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORK EXPERIENCE ── */}
      <section className="py-5 bg-white">
        <div className="container work-section-wrap">
          <h2 className="fw-bold text-center mb-5 section-heading text-dark-custom">
            My <span className="text-orange">Work Experience</span>
          </h2>

          {workExperience.map((work, index) => (
            <div key={work.id} className="row align-items-start g-3 mb-4">
              {/* Left */}
              <div className="col-5 text-end pt-2">
                <h3 className="fw-bold mb-1 work-title text-dark-custom">
                  {work.company}
                </h3>
                <p className="text-secondary mb-0 small">{work.period}</p>
              </div>

              {/* Dot + connector */}
              <div className="col-2 d-flex flex-column align-items-center pt-2">
                <div
                  className={`timeline-dot ${index === 1 ? "timeline-dot-dark" : "timeline-dot-orange"}`}
                />
                {index < workExperience.length - 1 && (
                  <div className="timeline-line" />
                )}
              </div>

              {/* Right */}
              <div className="col-5 pt-2">
                <h3 className="fw-bold mb-1 work-title text-dark-custom">
                  {work.position}
                </h3>
                <p className="text-secondary mb-0 small">{work.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
