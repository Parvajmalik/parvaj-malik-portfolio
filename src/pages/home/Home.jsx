import React from 'react';
import HomeView from './HomeView';

const Home = (props) => {
  const workExperience = [
    {
      id: 1,
      company: 'Cognizant, Mumbai',
      period: 'Sep 2016 - July 2020',
      position: 'Experience Designer',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis issus nunc, posuere in justo vulputate, bibendum sodales',
    },
    {
      id: 2,
      company: 'Sugee Pvt limited, Mumbai',
      period: 'Sep 2020 - July 2023',
      position: 'UI/UX Designer',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis issus nunc, posuere in justo vulputate, bibendum sodales',
    },
    {
      id: 3,
      company: 'Cinetstox, Mumbai',
      period: 'Sep 2023',
      position: 'Lead UX Designer',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis issus nunc, posuere in justo vulputate, bibendum sodales',
    },
  ];

  return <HomeView workExperience={workExperience} {...props} />;
};

export default Home;