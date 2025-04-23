import React from "react";

const Footer = () => {
  return (
    <div className="footer">
      © ApiTester {new Date().toLocaleString().slice(4, 8)}
    </div>
  );
};

export default Footer;
