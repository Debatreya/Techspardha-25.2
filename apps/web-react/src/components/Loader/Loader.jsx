import React from "react";

const LoaderWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #0a0a0a; /* pitch black */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const BatmanImage = styled(motion.img)`
  width: 200px; /* mask size */
  z-index: 1;
`;

export default function BatmanLoader() {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start({
      scale: [0.5, 10],      // starts smaller, grows slowly
      opacity: [0, 1],      // fades in from dark
      transition: { 
        duration: 6,        // slow cinematic reveal
        ease: "easeInOut"
      },
    });
  }, [controls]);

  return (
    <LoaderWrapper>
      <BatmanImage
        src={BatmanPNG}
        alt="Batman"
        animate={controls}
      />
    </LoaderWrapper>
  );
}
