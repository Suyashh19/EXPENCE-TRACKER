import { toast } from "react-toastify";
import React from "react";

export const toastConfirm = (message, onConfirm) => {
  toast(
    ({ closeToast }) => (
      <div className="confirm-toast">
        <p className="confirm-text">{message}</p>

        <div className="confirm-actions">
          <button
            className="confirm-btn yes"
            onClick={() => {
              onConfirm();
              closeToast();
            }}
          >
            Yes
          </button>

          <button
            className="confirm-btn no" onClick={closeToast}>
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      closeOnClick: false,
      autoClose: false,
      draggable: false,
    }
  );
};
