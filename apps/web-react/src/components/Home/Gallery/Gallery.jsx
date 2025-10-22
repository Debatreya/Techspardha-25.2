// All non-hover animations have been removed to keep only hover effects
// (glitch on image and subtle hover scale/shadow on containers)
import GalleryImage from "./GalleryImage";

// Using external image URLs instead of local imports

export default function Gallery() {
  const images = [
    "https://i.ibb.co/p5Gx6Kj/img9.jpg",
    "https://i.ibb.co/j9ZQqmzW/img4-min.jpg", 
    "https://i.ibb.co/5XPxmHb7/img2-min.jpg",
    "https://i.ibb.co/dwBdhq64/img3-min.jpg",
      "https://i.ibb.co/bg2QN1sG/img5-min.jpg",// tall image
    "https://i.ibb.co/LDXVdrwK/img1-min.jpg",
    "https://i.ibb.co/b5TjBN52/img8-min.jpg",
    "https://i.ibb.co/LhdCfTJ5/img6-min.jpg",
    "https://i.ibb.co/nMDtFtTG/img7-min.jpg",
  ];

  const smallHeight = "h-56";
  const largeHeight = "h-[26.5rem]";

  const containerHover =
    "transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_20px_#f77039]";

  const imageHover = "hover:animate-glitch";

  return (
    <div className="min-h-screen p-4 flex justify-center items-center flex-col">
      <p className="text-5xl md:text-7xl text-center text-primary font-gta mb-10">
        Gallery
      </p>

      <div className="w-[95vw] rounded-xl">
        <div className="grid gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`md:col-span-2 border-2 border-customGrey p-0 rounded-xl ${smallHeight} overflow-hidden ${containerHover}`}
            >
              <div className={`w-full h-full overflow-hidden ${imageHover}`}>
                <GalleryImage src={images[0]} alt="Top Left" />
              </div>
            </div>
            <div
              className={`md:col-span-1 border-2 border-customGrey p-0 rounded-xl ${smallHeight} overflow-hidden ${containerHover}`}
            >
              <div className={`w-full h-full overflow-hidden ${imageHover}`}>
                <GalleryImage src={images[1]} alt="Top Right" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`md:col-span-1 border-2 border-customGrey p-0 rounded-xl ${smallHeight} overflow-hidden ${containerHover}`}
            >
              <div className={`w-full h-full overflow-hidden ${imageHover}`}>
                <GalleryImage src={images[2]} alt="Middle Left" />
              </div>
            </div>
            <div
              className={`md:col-span-2 border-2 border-customGrey p-0 rounded-xl ${smallHeight} overflow-hidden ${containerHover}`}
            >
              <div className={`w-full h-full overflow-hidden ${imageHover}`}>
                <GalleryImage src={images[3]} alt="Middle Right" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`border-2 border-customGrey p-0 rounded-xl ${largeHeight} overflow-hidden ${containerHover}`}
            >
              <div className={`w-full h-full overflow-hidden ${imageHover}`}>
                <GalleryImage src={images[4]} alt="Large Left" />
              </div>
            </div>

            <div className="grid grid-cols-2 col-span-2 gap-3">
              {[5, 6, 7, 8].map((idx, i) => (
                <div
                  key={idx}
                  className={`border-2 border-customGrey rounded-xl overflow-hidden h-52 ${containerHover}`}
                >
                  <div
                    className={`w-full h-full overflow-hidden ${imageHover}`}
                  >
                    <GalleryImage src={images[idx]} alt={`Right ${idx}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
