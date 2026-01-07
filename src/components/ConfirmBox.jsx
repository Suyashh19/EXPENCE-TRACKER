import { toast } from "react-toastify";
import React from "react";

export const toastConfirm = (message, onConfirm) => {
  toast(
    ({ closeToast }) => (
      <div
        className="
          w-full
          max-w-sm
          px-4
          py-3
        "
      >
        {/* MESSAGE */}
        <p
          className="
            text-sm
            sm:text-base
            font-semibold
            text-slate-800
            mb-4
            leading-relaxed
          "
        >
          {message}
        </p>

        {/* ACTIONS */}
        <div
          className="
            flex
            flex-col sm:flex-row
            gap-3
            justify-end
          "
        >
          <button
            className="
              w-full sm:w-auto
              rounded-xl
              bg-emerald-500
              px-4
              py-2.5
              text-sm
              font-bold
              text-white
              transition
              hover:bg-emerald-600
              active:scale-95
            "
            onClick={() => {
              onConfirm();
              closeToast();
            }}
          >
            Yes
          </button>

          <button
            className="
              w-full sm:w-auto
              rounded-xl
              bg-slate-200
              px-4
              py-2.5
              text-sm
              font-bold
              text-slate-700
              transition
              hover:bg-slate-300
              active:scale-95
            "
            onClick={closeToast}
          >
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
