// All non-hover animations have been removed to keep only hover effects
// (glitch on image and subtle hover scale/shadow on containers)
import GalleryImage from "./GalleryImage";

// Import all gallery images
import DSC_0822 from "../../../assets/photos/Gallery/DSC_0822.jpg";
import DSC_ddd from "../../../assets/photos/Gallery/DSC_ddd.jpg";
import DSC_0596 from "../../../assets/photos/Gallery/DSC_0596.jpg";
import DSC_1748 from "../../../assets/photos/Gallery/DSC_1748-2.jpg";
import DSC_8415 from "../../../assets/photos/Gallery/DSC_8415.jpg";
import DSC_9314 from "../../../assets/photos/Gallery/DSC_9314.jpg";
import DSC_9355 from "../../../assets/photos/Gallery/DSC_9355.jpg";
import DSC_9372 from "../../../assets/photos/Gallery/DSC_9372.jpg";
import DSC_9238 from "../../../assets/photos/Gallery/DSC_9238.jpg";

export default function Gallery() {
  const images = [
    DSC_0822,
    DSC_ddd,
    DSC_0596,
    DSC_1748,
    DSC_8415, // tall image
    DSC_9314,
    DSC_9355,
    DSC_9372,
    DSC_9238,
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
