import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import Button from "./Button";

function Modal({ isOpen, title, description, onClose, children, footer }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onMouseDown={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
          </div>
          <Button
            variant="icon"
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <FiX />
          </Button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
