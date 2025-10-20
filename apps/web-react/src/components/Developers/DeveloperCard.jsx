import React, { useEffect, useRef, useCallback, useMemo } from "react";
import "./ProfileCard.css";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa"; // Keep this original import

const DEFAULT_BEHIND_GRADIENT =
  "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 320,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  FOLLOW_SMOOTHING: 0.32, // 0..1, higher follows faster
  FOLLOW_EPSILON: 0.15, // px threshold to consider as reached
};

const clamp = (value, min = 0, max = 100) =>
  Math.min(Math.max(value, min), max);

const round = (value, precision = 3) => parseFloat(value.toFixed(precision));

const adjust = (value, fromMin, fromMax, toMin, toMax) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const ProfileCardComponent = ({
  avatarUrl = "<Placeholder for avatar URL>",
  iconUrl = "<Placeholder for icon URL>",
  grainUrl = "<Placeholder for grain URL>",
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  className = "",
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = "Javi A. Torres",
  title = "Software Engineer",
  handle = "javicodes", // Used for social media links
  // Optional backend-provided social links (full URLs or handles)
  github,
  insta,
  linkedin,
  status = "Online",
  contactText = "Contact",
  showUserInfo = true,
  onContactClick,
}) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;

    let rafId = null;
    let followRaf = null;
    let currentX = null;
    let currentY = null;
    let targetX = null;
    let targetY = null;

    const updateCardTransform = (offsetX, offsetY, card, wrap) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };

    const createSmoothAnimation = (duration, startX, startY, card, wrap) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    const setTarget = (x, y) => {
      targetX = x;
      targetY = y;
      if (currentX == null || currentY == null) {
        currentX = x;
        currentY = y;
      }
    };

    const startFollow = (card, wrap) => {
      if (followRaf) return; // already running
      const loop = () => {
        if (
          currentX == null ||
          currentY == null ||
          targetX == null ||
          targetY == null
        ) {
          followRaf = requestAnimationFrame(loop);
          return;
        }
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        currentX += dx * ANIMATION_CONFIG.FOLLOW_SMOOTHING;
        currentY += dy * ANIMATION_CONFIG.FOLLOW_SMOOTHING;
        updateCardTransform(currentX, currentY, card, wrap);
        followRaf = requestAnimationFrame(loop);
      };
      followRaf = requestAnimationFrame(loop);
    };

    const stopFollow = () => {
      if (followRaf) {
        cancelAnimationFrame(followRaf);
        followRaf = null;
      }
    };

    return {
      updateCardTransform,
      setTarget,
      startFollow,
      stopFollow,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        stopFollow();
      },
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback(
    (event) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      animationHandlers.setTarget(x, y);
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.classList.add("active");
    card.classList.add("active");
    // subtle drop on hover
    card.style.setProperty("--hover-drop", "8px");
    // 3D pop-out
    card.style.setProperty("--popout-z", "80px");
    card.style.setProperty("--popout-scale", "1.04");
    // start smooth follow from center
    const cx = wrap.clientWidth / 2;
    const cy = wrap.clientHeight / 2;
    animationHandlers.setTarget(cx, cy);
    animationHandlers.startFollow(card, wrap);
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (event) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      // stop follow immediately and play a quick ease-to-center
      animationHandlers.stopFollow();
      const cx = wrap.clientWidth / 2;
      const cy = wrap.clientHeight / 2;
      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        event.offsetX,
        event.offsetY,
        card,
        wrap
      );
      // quickly reset state
      setTimeout(() => {
        wrap.classList.remove("active");
        card.classList.remove("active");
        card.style.removeProperty("--hover-drop");
        card.style.removeProperty("--popout-z");
        card.style.removeProperty("--popout-scale");
      }, ANIMATION_CONFIG.SMOOTH_DURATION);
    },
    [animationHandlers]
  );

  const handleDeviceOrientation = useCallback(
    (event) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const { beta, gamma } = event;
      if (!beta || !gamma) return;

      // NOTE: This logic for beta/gamma to x/y seems swapped or unconventional.
      // Gamma (side-to-side) usually maps to X, and Beta (front-to-back) to Y.
      // I'm keeping the original logic for now but noting it might be a logic error.
      animationHandlers.updateCardTransform(
        card.clientWidth / 2 + gamma * mobileTiltSensitivity,
        card.clientHeight / 2 +
          (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        card,
        wrap
      );
    },
    [animationHandlers, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;

    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap) return;

    const pointerMoveHandler = handlePointerMove;
    const pointerEnterHandler = handlePointerEnter;
    const pointerLeaveHandler = handlePointerLeave;
    const deviceOrientationHandler = handleDeviceOrientation;

    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== "https:") return;
      if (
        typeof window.DeviceOrientationEvent.requestPermission === "function"
      ) {
        // Should be DeviceOrientationEvent for orientation
        window.DeviceOrientationEvent.requestPermission()
          .then((state) => {
            if (state === "granted") {
              window.addEventListener(
                "deviceorientation",
                deviceOrientationHandler
              );
            }
          })
          .catch((err) => console.error(err));
      } else {
        window.addEventListener("deviceorientation", deviceOrientationHandler);
      }
    };

    card.addEventListener("pointerenter", pointerEnterHandler);
    card.addEventListener("pointermove", pointerMoveHandler);
    card.addEventListener("pointerleave", pointerLeaveHandler);

    // Attach click listener for permission request only on mobile tilt enablement
    if (enableMobileTilt) {
      card.addEventListener("click", handleClick);
    }

    // Initial animation setup
    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;

    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(
      ANIMATION_CONFIG.INITIAL_DURATION,
      initialX,
      initialY,
      card,
      wrap
    );

    return () => {
      card.removeEventListener("pointerenter", pointerEnterHandler);
      card.removeEventListener("pointermove", pointerMoveHandler);
      card.removeEventListener("pointerleave", pointerLeaveHandler);
      if (enableMobileTilt) {
        card.removeEventListener("click", handleClick);
      }
      window.removeEventListener("deviceorientation", deviceOrientationHandler);
      animationHandlers.cancelAnimation();
    };
  }, [
    enableTilt,
    enableMobileTilt,
    animationHandlers,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation,
  ]);

  const cardStyle = useMemo(
    () => ({
      "--icon": iconUrl ? `url(${iconUrl})` : "none",
      "--grain": grainUrl ? `url(${grainUrl})` : "none",
      "--behind-gradient": showBehindGradient
        ? (behindGradient ?? DEFAULT_BEHIND_GRADIENT)
        : "none",
      "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
    }),
    [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient]
  );

  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  // Build safe social URLs from backend values or fall back to handle
  const buildSocialUrl = useCallback((platform, value, fallbackHandle) => {
    const v = (value || "").trim();
    const h = (fallbackHandle || "").replace(/^@/, "").trim();
    const isUrl = (str) => /^https?:\/\//i.test(str);
    const sanitize = (str) => str.replace(/^@/, "").replace(/\/$/, "");

    const byPlatform = (user) => {
      switch (platform) {
        case "instagram":
          return `https://instagram.com/${user}`;
        case "linkedin":
          return `https://linkedin.com/in/${user}`;
        case "github":
          return `https://github.com/${user}`;
        default:
          return null;
      }
    };

    if (v) {
      if (isUrl(v)) return v;
      const user = sanitize(v);
      if (user) return byPlatform(user);
    }
    if (h) return byPlatform(h);
    return null;
  }, []);

  const instagramUrl = useMemo(
    () => buildSocialUrl("instagram", insta, handle),
    [buildSocialUrl, insta, handle]
  );
  const linkedinUrl = useMemo(
    () => buildSocialUrl("linkedin", linkedin, handle),
    [buildSocialUrl, linkedin, handle]
  );
  const githubUrl = useMemo(
    () => buildSocialUrl("github", github, handle),
    [buildSocialUrl, github, handle]
  );

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper ${className}`.trim()}
      style={cardStyle}
    >
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />
          {/* Top section: image only (larger) */}
          <div className="pc-avatar-content flex flex-col">
            <img
              className="avatar mb-10"
              src={avatarUrl}
              alt={`${name || "User"} avatar`}
              loading="lazy"
              onError={(e) => {
                const target = e.target;
                target.style.display = "none";
              }}
            />
            {/* Social Media Links (backend-driven with fallback) */}
                <div className="pc-social" style={{ marginTop: "0.5rem" }}>
                  <button
                    onClick={() =>
                      instagramUrl && window.open(instagramUrl, "_blank")
                    }
                    aria-label="Instagram"
                    className="transition-transform transform hover:scale-110"
                    style={{ pointerEvents: "auto" }}
                    type="button"
                    disabled={!instagramUrl}
                  >
                    <FaInstagram size={28} />
                  </button>
                  <button
                    onClick={() =>
                      linkedinUrl && window.open(linkedinUrl, "_blank")
                    }
                    aria-label="LinkedIn"
                    className="transition-transform transform hover:scale-110"
                    style={{ pointerEvents: "auto" }}
                    type="button"
                    disabled={!linkedinUrl}
                  >
                    <FaLinkedin size={28} />
                  </button>
                  <button
                    onClick={() =>
                      githubUrl && window.open(githubUrl, "_blank")
                    }
                    aria-label="GitHub"
                    className="transition-transform transform hover:scale-110"
                    style={{ pointerEvents: "auto" }}
                    type="button"
                    disabled={!githubUrl}
                  >
                    <FaGithub size={28} />
                  </button>
                </div>
          </div>

          {/* Bottom section: simplified details with social icons; removed mini avatar and extra text */}
          {showUserInfo && (
            <div className="pc-bottom-content">
              <div className="pc-user-info">
                <div className="pc-details" style={{ textAlign: "center" }}>
                  <h3>{name}</h3>
                  <p className="pc-title">{title}</p>
                </div>

                
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);

export default ProfileCard;
