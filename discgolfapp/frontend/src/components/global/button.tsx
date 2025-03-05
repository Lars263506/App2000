import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="text-white font-bold py-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#5A8FCC]"
      style={{
        backgroundColor: "#5DBB63", // Primær grønn
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4CA454")} // Mørkere grønn på hover
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#5DBB63")} // Tilbake til vanlig grønn
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
