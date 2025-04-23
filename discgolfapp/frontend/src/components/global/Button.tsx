import React from "react";

/**
 * @author Adrian Johansen
 * @description This is a reusable button component with custom styles and hover effects.
 * It supports all standard button attributes and allows dynamic content through children props.
 * The button changes color on hover and includes focus styling for accessibility.
 */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="text-white font-bold py-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#5A8FCC]"
      style={{
        backgroundColor: "#5DBB63", 
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4CA454")} 
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#5DBB63")} 
    >
      {children}
    </button>
  );
};

export default Button;
