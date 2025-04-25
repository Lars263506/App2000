import React from 'react';
import ReactDOM from 'react-dom';


/**
 * @description The Modal component provides a reusable modal dialog box for displaying content.
 * It uses React Portals to render the modal outside the main DOM hierarchy, ensuring proper layering.
 * The modal includes a close button and supports custom content passed as children.
 * 
 * Features:
 * - Displays a modal overlay with a semi-transparent background.
 * - Includes a close button to dismiss the modal.
 * - Supports custom content through the `children` prop.
 * - Uses React Portals for rendering outside the main DOM hierarchy.
 * - Styled for responsiveness and accessibility.
 * 
 * Copilot has been used to generate the code for the functions and comments,
 * but has been reviewed and edited by the authors
 * 
 */

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
