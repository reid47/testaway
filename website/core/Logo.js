const React = require('react');

module.exports = function Logo({ outerColor, innerColor, ...props }) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 149.34">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 149.34">
        <path
          fill={outerColor || 'currentColor'}
          d="M70,53.51V29.13A15,15,0,0,0,80,15h0A15,15,0,0,0,65,0H35A15,15,0,0,0,20,15h0A15,15,0,0,0,30,29.13V53.51a50,50,0,1,0,40,0ZM50,139.34A40,40,0,0,1,40,60.6V20H35a5,5,0,0,1,0-10H65a5,5,0,0,1,0,10H60V60.6a40,40,0,0,1-10,78.74Z"
        />
        <path
          fill={innerColor || 'currentColor'}
          d="M80,99.34a30,30,0,1,1-58.29-10c11.52.34,17.14-3.3,21.66-6.79,5.07-3.92,9.83-6.41,16.71-5.82C66.65,77.27,74.53,82,75.81,84A29.87,29.87,0,0,1,80,99.34Z"
        />
      </svg>
    </svg>
  );
};
