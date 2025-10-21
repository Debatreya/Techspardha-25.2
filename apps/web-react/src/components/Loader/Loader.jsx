import React from "react";
import "./Loader.css";

// Neon Rings Loader
// - Matches web-react Tailwind theme (primary: #f77039, dark bg, subtle greys)
// - Self-contained CSS animations so it works without Tailwind utilities
// - Accessible with aria-busy and aria-label
// - Not used anywhere by default

const Loader = ({
  label = "Loading",
  size = 240,
  color,
  centerOnScreen = true,
}) => {
  const px = typeof size === "number" ? `${size}px` : size;
  const style = {
    width: px,
    height: px,
    ...(color ? { "--ts-primary": color, "--ts-primary-border": color } : {}),
  };

  const content = (
    <div
      className="ts-loader-wrapper"
      role="status"
      aria-busy="true"
      aria-label={label}
    >
      <div className="ts-loader" style={style}>
        <div className="ring ring1" />
        <div className="ring ring2" />
        <div className="ring ring3" />
        <div className="core">
          <div className="core-glow" />
          <div className="dot dot-a" />
          <div className="dot dot-b" />
          <div className="dot dot-c" />
        </div>
      </div>
      <span className="ts-loader-label" aria-hidden="true">
        {label}…
      </span>
    </div>
  );

  return centerOnScreen ? (
    <div className="ts-loader-screen">{content}</div>
  ) : (
    content
  );
};

export default Loader;
