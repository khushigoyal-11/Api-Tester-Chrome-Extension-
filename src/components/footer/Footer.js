import React from "react";

const Footer = () => {
  return (
    <div className='footer'>
      <div className=''>
        <a href='https://dev.to/ayushi_verma/apidesk-4gef' target='_blank'>
          Doc
        </a>
      </div>
      <div className=''>
        <a href='https://github.com/Ayushi20-19/apidesk' target='_blank'>
          Github
        </a>
      </div>
      ©ApiDesk {new Date().toLocaleString().slice(4, 8)}
    </div>
  );
};

export default Footer;
