import React from "react";
import { Star, NorthEast } from "@mui/icons-material";
import invertedComoTopIcon from "../../assets/img/invertedComoTopIcon.svg";
import invertedComoBottomIcon from "../../assets/img/invertedComoBottomIcon.svg";
import "../../assets/css/Home.css";

const HomeView = ({ workExperience }) => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-greeting">
            <svg
              width="32"
              height="33"
              className="greeting-decoration-top"
              viewBox="0 0 32 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.00055 20.0005C2.00055 17.0005 5.00055 11.0005 2.00055 2.00054M9.50055 23.5005C13.8339 19.3339 22.7005 9.20054 23.5005 2.00054M12.5005 30.5005C15.1672 30.5005 22.3005 29.1005 29.5005 23.5005"
                stroke="#FEB273"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span className="greeting-bubble">Hello!</span>
          </div>

          <div className="hero-title-container">
            <h1 className="hero-title">
              I'm <span className="highlight">Parvej</span>,<br />
              Embedded Engineer
            </h1>
            <svg
              width="74"
              className="title-decoration-bottom"
              height="85"
              viewBox="0 0 74 85"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M70.7544 35.9953C69.0721 43.6553 58.0474 57.293 60.6604 81.9553M53.5672 22.8528C40.1662 31.0616 11.8441 51.9631 5.7638 69.8985M49.8327 3.29717C43.0238 1.80175 24.0249 1.37619 2.50059 11.6372"
                stroke="#FEB273"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <div className="hero-main-content">
            <div className="hero-testimonial">
              <div className="quote-mark">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.135 17.445H5.1C5.22 10.44 6.6 9.28499 10.905 6.73499C11.4 6.43499 11.565 5.80499 11.265 5.29499C10.98 4.79999 10.335 4.63499 9.84 4.93499C4.77 7.93499 3 9.76499 3 18.48V26.565C3 29.13 5.085 31.2 7.635 31.2H12.135C14.775 31.2 16.77 29.205 16.77 26.565V22.065C16.77 19.44 14.775 17.445 12.135 17.445Z"
                    fill="#344054"
                  />
                  <path
                    d="M28.365 17.445H21.33C21.45 10.44 22.83 9.28499 27.135 6.73499C27.63 6.43499 27.795 5.80499 27.495 5.29499C27.195 4.79999 26.565 4.63499 26.055 4.93499C20.985 7.93499 19.215 9.76499 19.215 18.495V26.58C19.215 29.145 21.3 31.215 23.85 31.215H28.35C30.99 31.215 32.985 29.22 32.985 26.58V22.08C33 19.44 31.005 17.445 28.365 17.445Z"
                    fill="#344054"
                  />
                </svg>
              </div>
              <p>
                Parvej's exceptional embedded engineering work made a huge
                impact on our project. Highly recommended.
              </p>
            </div>

            <div className="hero-image-container">
              <div className="hero-image-semicircle">
                <img
                  width={"100%"}
                  height={"600px"}
                  src="/parvaj_malik.png"
                  alt="Parvej Malik"
                  className="hero-image"
                />
              </div>
            </div>

            <div className="hero-badge">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    style={{ color: "#ff8c42", fontSize: "1.2rem" }}
                  />
                ))}
              </div>
              <div className="experience-text">
                <strong>3 Years</strong>
                <span>Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-container">
          <h2 className="section-title">
            About <span className="highlight">Me</span>
          </h2>
          <p className="about-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis locus
            nunc, posuere in justo vulputate, bibendum sodales
          </p>

          <div className="services-grid">
            <div className="service-card">
              <h3>Embedded firmware development</h3>
              <div className="service-image">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"
                  alt="Firmware"
                />
              </div>
              <button className="service-btn">
                <NorthEast />
              </button>
            </div>

            <div className="service-card">
              <h3>Biomedical products development</h3>
              <div className="service-image">
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400"
                  alt="Biomedical"
                />
              </div>
              <button className="service-btn">
                <NorthEast />
              </button>
            </div>

            <div className="service-card">
              <h3>Full system designs with H/W and S/W</h3>
              <div className="service-image">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400"
                  alt="System Design"
                />
              </div>
              <button className="service-btn">
                <NorthEast />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="experience-section">
        <div className="experience-container">
          <h2 className="section-title">
            My <span className="highlight">Work Experience</span>
          </h2>

          <div className="timeline">
            {workExperience.map((work, index) => (
              <div key={work.id} className="timeline-item">
                <div className="timeline-left">
                  <h3 className="company-name">{work.company}</h3>
                  <p className="work-period">{work.period}</p>
                </div>
                <div className="timeline-marker">
                  <div
                    className={`timeline-dot ${index === 1 ? "active" : ""}`}
                  ></div>
                  {index < workExperience.length - 1 && (
                    <div className="timeline-line"></div>
                  )}
                </div>
                <div className="timeline-right">
                  <h3 className="position-name">{work.position}</h3>
                  <p className="work-description">{work.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
