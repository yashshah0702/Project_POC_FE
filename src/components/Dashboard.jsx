import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { getData } from "../services/api-services";
import { apiPaths } from "../constants/apiPaths";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Import images
import bgImage from "../assets/bg-image.jpg";
import mobileBg from "../assets/mobile-bg-image.png";
import ipadBg from "../assets/ipad-bg-image.png";
import ipadBigBg from "../assets/ipad-bg-image1.png";
import atqorLogo from "../assets/atqorLogo.png";
import ceoImage from "../assets/ceoImage.png";

const Dashboard = () => {
  const { accounts } = useMsal();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState("");
  const [fileType, setFileType] = useState("");

  const token = localStorage.getItem("accessToken");

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

  const videoLinks = [
    {
      link: "https://diwali2025storage.blob.core.windows.net/media/7121788-hd_1920_1080_30fps.mp4",
      name: "Pushkaraj Kale",
    },
    {
      link: "https://diwali2025storage.blob.core.windows.net/media/7685289-hd_1920_1080_30fps.mp4",
      name: "Kartik Shah",
    },
    {
      link: "https://diwali2025storage.blob.core.windows.net/media/8240564-hd_1920_1080_25fps.mp4",
      name: "Devi Prasaad Saaho",
    },
    {
      link: "https://diwali2025storage.blob.core.windows.net/media/8811131-hd_1920_1080_25fps.mp4",
      name: "Amit Gadhvi",
    },
    {
      link: "https://diwali2025storage.blob.core.windows.net/media/8811355-hd_1920_1080_25fps.mp4",
      name: "C S Lakshmi Narayanan",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1); // Mobile (sm)
        setCurrentIndex(0); // Reset to first video on mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2); // Tablet (md)
        setCurrentIndex(0);
      } else {
        setVisibleCount(3); // Desktop (lg+)
        setCurrentIndex(0);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const totalVideos = videoLinks.length;

  useEffect(() => {
    if (accounts.length > 0) {
      setUserInfo(accounts[0]);
      setLoading(false);
    }
  }, [accounts]);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev >= totalVideos - visibleCount ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev <= 0 ? totalVideos - visibleCount : prev - 1
    );
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const isImage = selectedFile.type.startsWith("image/");
    const isVideo = selectedFile.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Only image or video files are allowed!");
      return;
    }
    if (isImage && selectedFile.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be less than 5MB!");
      return;
    }
    if (isVideo && selectedFile.size > MAX_VIDEO_SIZE) {
      toast.error("Video size must be less than 20MB!");
      return;
    }

    setFileType(isImage ? "image" : "video");
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setFileBase64(reader.result);
    reader.readAsDataURL(selectedFile);

    e.target.value = "";
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileBase64("");
    setFileType("");

    const fileInput = document.getElementById("feedback-file");
    if (fileInput) fileInput.value = "";
  };

  const handleFeedbackSubmit = async () => {
    if (feedback.trim()) {
      try {
        const payload = {
          text: feedback,
          fileUrl: fileBase64 || null,
        };
        await getData(apiPaths.CREATE_MESSAGE, "POST", payload, token);
        setFeedbackSubmitted(true);
        toast.success("Feedback submitted successfully!");
        setTimeout(() => {
          setFeedback("");
          setFeedbackSubmitted(false);
          handleRemoveFile();
        }, 3000);
      } catch (error) {
        console.error("Error submitting feedback:", error);
        setFeedbackSubmitted(false);
        toast.error("Failed to submit feedback!");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
          <div className="text-slate-800 text-xl font-semibold">
            Loading Dashboard...
          </div>
          <div className="text-slate-600 text-sm mt-2">
            Preparing your analytics experience
          </div>
        </div>
      </div>
    );
  }

  const userName = userInfo?.name || "User";
  const firstName = userName.split(" ")[0];

  return (
    <div className="min-h-screen relative  font-sans">
      <div
        className="absolute inset-0 z-0 sm:hidden"
        style={{
          backgroundImage: `url(${mobileBg})`,
          backgroundSize: "cover",
          backgroundPosition: "left top",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8fafc",
          opacity: 0.9,
        }}
      ></div>

      {/* ✅ Tablet */}
      <div
        className="absolute inset-0 z-0 hidden sm:block md:hidden"
        style={{
          backgroundImage: `url(${ipadBg})`,
          backgroundSize: "cover",
          backgroundPosition: "left top",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8fafc",
          opacity: 0.9,
        }}
      ></div>

      {/* ✅ Desktop */}
      <div
        className="absolute inset-0 z-0 hidden md:block lg:hidden"
        style={{
          backgroundImage: `url(${ipadBigBg})`,
          backgroundSize: "cover",
          backgroundPosition: "left top",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8fafc",
          opacity: 0.9,
        }}
      ></div>

      {/* ✅ Large screens */}
      <div
        className="absolute inset-0 z-0 hidden lg:block"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "left top",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#f8fafc",
          opacity: 0.9,
        }}
      ></div>

      <ToastContainer />

      {/* ✅ Header */}
      <div>
        <header className="max-w-[57rem] mx-auto relative w-full h-[190px] sm:h-[230px] md:h-[300px] flex flex-col item-center sm:items-start justify-start sm:justify-center text-center px-4 sm:px-7 md:px-4 pt-4 md:pt-24">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <img
              src={atqorLogo}
              alt="atQor Logo"
              className=" h-5 sm:h-7 md:h-12 "
            />
            <h1 className="text-2xl sm:text-3xl  md:text-5xl  font-bold text-[#000000]">
              Wali Diwali <span className="text-[#000000]">@2025</span>
            </h1>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            Where tradition meets taste, and gifting gets a glow-up
          </p>
        </header>

        <main className="relative pb-16 pt-0 sm:pt-4 md:pt-20">
          <div className="max-w-[60rem] mx-auto px-4 sm:px-6  lg:px-8 pb-8">
            {/* ✅ Diwali Message Section */}
            <div className="bg-[#FBEEDE]/70 rounded-3xl p-4 mb-4 border-2 border-[#B99C66]">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Dear {firstName},
                </h2>

                <p className="text-gray-700 leading-relaxed">
                  This Diwali, as we celebrate light, warmth, and new
                  beginnings, we want to recognize the strength, resilience, and
                  unity that you — and your family — bring to atQor.
                </p>

                <h3 className="font-semibold italic text-orange-800 mb-3">
                  Crafted with Heart, Rooted in India
                </h3>
                <p className="text-gray-700">
                  This Diwali, we go beyond gifting — we create experiences that
                  connect hearts, celebrate traditions, and strengthen
                  relationships.
                </p>

                <div className="space-y-4 text-gray-700">
                  <p>
                    Each hamper is a fusion of cultural richness and modern
                    elegance, thoughtfully curated to reflect the spirit of the
                    festival.
                  </p>
                  <p>
                    From brass bell essentials to scented candles and premium
                    dry fruits, every item tells a story of care, celebration,
                    and Indian craftsmanship.
                  </p>
                  <p>
                    Sourced from local artisans, our hampers proudly support the
                    Make in India initiative, honoring the legacy of handmade
                    excellence.
                  </p>
                  <p>
                    With sustainable packaging and reusable elements, we embrace
                    eco-conscious values while preserving festive charm.
                  </p>

                  <p className="font-semibold italic text-orange-800 mb-3">
                    Let this gift be more than a gesture — let it be a heartfelt
                    experience that lingers long after the festivities.
                  </p>

                  <p>
                    Our wellness initiatives this year were just one part of our
                    dedication to each of you as a valued member of the atQor
                    family. We know that behind each success is the support and
                    care of your family, who share in your efforts and
                    achievements.
                  </p>

                  <p>
                    This Diwali, we thank you and your loved ones for being part
                    of our journey. May the season bring joy and warmth to all.
                  </p>

                  <p className="font-semibold italic text-orange-800 mb-3">
                    atQor Wali Diwali, unwrap joy in every jar.
                  </p>

                  <p className="text-gray-600 italic">
                    Thank you for being a part of our journey.
                  </p>
                </div>

                {/* ✅ Signature */}
                <div className=" border-t border-gray-200">
                  <p className="text-gray-700 mb-4">With gratitude,</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={ceoImage}
                      alt="CEO"
                      className="w-16 h-16 rounded-full border-2 border-orange-200 shadow-lg"
                    />
                    <div>
                      <div className="font-bold text-gray-800 text-lg">
                        Pushkaraj Kale
                      </div>
                      <div className="text-gray-600">CEO</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Video Carousel Section */}
            {/* <div className="bg-[#FBEEDE]/60 rounded-3xl p-4 mb-4 border-2 border-[#B99C66] relative">
              <h2 className="text-2xl font-semibold text-gray-800  text-left">
                Leadership Diwali Wishes
              </h2>

             
              <div className="relative"> */}
            {/* <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(-${
                        currentIndex * (100 / visibleCount)
                      }%)`,
                    }}
                  > */}
            {/* {videoLinks.map((video, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-1/3 px-2 py-2"
                        style={{
                          minWidth: `${100 / visibleCount}%`,
                        }}
                      >
                        <div className="rounded-xl overflow-hidden ">
                          <video
                            className="w-full h-48"
                            src={video.link}
                            title={`Video ${index + 1}`}
                            autoPlay
                            muted
                            loop
                            style={{ pointerEvents: "none" }}
                          />
                          <p className="text-center font-semibold">
                            {video.name}
                          </p>
                        </div>
                      </div>
                    ))} */}
            {/* </div>
                </div> */}

            {/* Navigation Arrows */}
            {/* <button
                  onClick={handlePrev}
                  className="absolute cursor-pointer top-1/2 -left-3 transform -translate-y-1/2 bg-[#B99C66] text-white px-4 py-2 rounded-full opacity-40 hover:opacity-90 shadow-md hover:bg-[#a07e3a]"
                >
                  ❮
                </button>
                <button
                  onClick={handleNext}
                  className="absolute cursor-pointer top-1/2 -right-3 transform -translate-y-1/2 bg-[#B99C66] text-white px-4 py-2 rounded-full opacity-40 hover:opacity-90 shadow-md hover:bg-[#a07e3a]"
                >
                  ❯
                </button>
              </div>
            </div> */}

            {/* ✅ Feedback Section */}
            <div className="bg-[#FBEEDE]/50 rounded-3xl p-2  mb-8 border-2 border-[#B99C66] relative">
              <div className="p-4">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                  {firstName} Share Your Diwali Wishes
                </h2>

                <div className="relative">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your wishes, images, or videos..."
                    className="w-full px-4 py-3 border border-[#B99C66] rounded-xl focus:border-transparent resize-none transition-all duration-200 pr-10"
                    rows="5"
                  />

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    id="feedback-file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    disabled={!!file}
                    style={{ display: "none" }}
                  />

                  {/* Upload Icon */}
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("feedback-file").click()
                    }
                    disabled={!!file}
                    className={`absolute bottom-3 left-3 text-[#B99C66] hover:text-[#a7884f] ${
                      file ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="w-6 h-6 lucide lucide-paperclip-icon lucide-paperclip"
                    >
                      <path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" />
                    </svg>
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="w-7 h-7 lucide lucide-upload-icon lucide-upload"
                    >
                      <path d="M12 3v12" />
                      <path d="m17 8-5-5-5 5" />
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    </svg> */}
                  </button>
                </div>

                <div className="mt-4 block sm:flex justify-between">
                  <div className="">
                    {file && (
                      <div className="flex items-center gap-2 mt-2 mb-2 sm:mb-0">
                        <span className="text-sm text-slate-800">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                          MB)
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="text-red-500  cursor-pointer text-sm hover:text-red-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            // width="24"
                            // height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="w-5 h-5 lucide lucide-circle-x-icon lucide-circle-x"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="m15 9-6 6" />
                            <path d="m9 9 6 6" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={!feedback.trim() || feedbackSubmitted}
                    className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      feedbackSubmitted
                        ? "bg-[#B99C66] text-white"
                        : feedback.trim()
                        ? "bg-[#B99C66] hover:bg-[#B99C66] opacity-80 hover:opacity-100 hover:cursor-pointer text-white"
                        : "bg-[#B99C66] text-white opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {feedbackSubmitted ? "Submitted!" : "Submit Feedback "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
