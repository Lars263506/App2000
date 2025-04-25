import React from "react";

/**
 * @description The SelectButton component provides a reusable button with hover effects and custom styling.
 * It is designed to be used as a selectable button in various parts of the application.
 * The button supports all standard HTML button attributes and allows custom content through the `children` prop.
 * 
 * Features:
 * - Customizable button with hover effects.
 * - Supports all standard HTML button attributes.
 * - Styled for responsiveness and accessibility.
 * - Allows custom content through the `children` prop.
 * 
 * Copilot has been used to generate the code for the functions and comments,
 * but has been reviewed and edited by the authors
 * 
 */







interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SelectButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="m-1 rounded-md font-bold transition-colors duration-300 bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[#5A8FCC]"
      style={{
        backgroundColor: "gray",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4CA454")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "gray")}
      {...props}
    >
      {children}
    </button>
  );
};

export default SelectButton;
