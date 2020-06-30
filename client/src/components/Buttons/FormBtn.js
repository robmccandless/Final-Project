import React from "react";
import "./style.css";

// The ...props means, spread all of the passed props onto this element
// That way we don't have to define them all individually
function FormBtn(props) {
  return (
    <span className="form-btn" {...props} role="button" tabIndex="0">
      ✗
    </span>
  );
}

export default FormBtn;
