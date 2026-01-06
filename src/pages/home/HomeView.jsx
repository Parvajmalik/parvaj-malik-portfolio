import React from 'react';
import { Star, NorthEast } from '@mui/icons-material';
import '../../assets/css/Home.css';

const HomeView = ({ workExperience }) => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-greeting">Hello!</div>
            <h1 className="hero-title">
              I'm <span className="highlight">Parvej</span>,<br />
              Embedded Engineer
            </h1>
            <div className="hero-image-container">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
                alt="Parvej Malik"
                className="hero-image"
              />
              <div className="hero-badge">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} style={{ color: '#ff8c42', fontSize: '1rem' }} />
                  ))}
                </div>
                <div className="experience-text">
                  <strong>3 Years</strong>
                  <span>Experience</span>
                </div>
              </div>
            </div>
            <div className="hero-testimonial">
              <p>"Parvej's exceptional embedded engineering work made a huge impact on our project. Highly recommended."</p>
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis locus nunc, posuere in justo vulputate, bibendum sodales
          </p>

          <div className="services-grid">
            <div className="service-card">
              <h3>Embedded firmware development</h3>
              <div className="service-image">
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400" alt="Firmware" />
              </div>
              <button className="service-btn">
                <NorthEast />
              </button>
            </div>

            <div className="service-card">
              <h3>Biomedical products development</h3>
              <div className="service-image">
                <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400" alt="Biomedical" />
              </div>
              <button className="service-btn">
                <NorthEast />
              </button>
            </div>

            <div className="service-card">
              <h3>Full system designs with H/W and S/W</h3>
              <div className="service-image">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400" alt="System Design" />
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
                <div className="timeline-marker">
                  <div className={`timeline-dot ${index === 1 ? 'active' : ''}`}></div>
                  {index < workExperience.length - 1 && <div className="timeline-line"></div>}
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <div>
                      <h3 className="company-name">{work.company}</h3>
                      <p className="work-period">{work.period}</p>
                    </div>
                    <div className="position-tag">{work.position}</div>
                  </div>
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