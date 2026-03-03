import { createContext, useContext, useEffect, useState } from "react";

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/my-portfolio.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <PortfolioContext.Provider value={data}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
