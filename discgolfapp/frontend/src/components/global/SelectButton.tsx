import React from "react";

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
