import { useState, useRef, useEffect } from "react";
import "./index.css";
import confetti from "canvas-confetti";


import img1 from "./assets/skyfeb1.jpeg";
import img2 from "./assets/skyfeb2.jpeg";
import img3 from "./assets/skyfeb3.jpeg";
import img4 from "./assets/skyfeb4.jpeg";
import img5 from "./assets/skyfeb5.jpeg";
import img6 from "./assets/skyfeb6.jpeg";
import img7 from "./assets/skyfeb7.jpeg";

const images = [img1, img2, img3, img4, img5, img6, img7];

function App() {
  const [accepted, setAccepted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [noStyle, setNoStyle] = useState({ transform: "translate(0,0)" });

  const [imageIndex, setImageIndex] = useState(0);
  const [showQuote, setShowQuote] = useState(false);

  const audioRef = useRef(new Audio("/music.mp3"));
  const fadeRef = useRef(null);

  /* 🚫 Move NO button */
  const moveNo = () => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 120 - 60;
    setNoStyle({ transform: `translate(${x}px, ${y}px)` });
  };

  /* 🎉 Confetti */
  const blastConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  /* 🎵 Smooth fade-in music */
  const playMusicSmoothly = () => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0;
    audio.play();

    let vol = 0;
    clearInterval(fadeRef.current);
    fadeRef.current = setInterval(() => {
      if (vol < 0.8) {
        vol += 0.04;
        audio.volume = vol;
      } else {
        clearInterval(fadeRef.current);
      }
    }, 200);

    setPlaying(true);
  };

  /* 🔇 Smooth fade-out music */
  const pauseMusicSmoothly = () => {
    const audio = audioRef.current;
    let vol = audio.volume;

    clearInterval(fadeRef.current);
    fadeRef.current = setInterval(() => {
      if (vol > 0.05) {
        vol -= 0.05;
        audio.volume = vol;
      } else {
        clearInterval(fadeRef.current);
        audio.pause();
        audio.volume = 0;
      }
    }, 150);

    setPlaying(false);
  };

  /* 🎵 Toggle music */
  const toggleMusic = () => {
    if (!playing) playMusicSmoothly();
    else pauseMusicSmoothly();
  };

  /* 🖼️ Image blast sequence */
  useEffect(() => {
    if (!accepted) return;

    if (imageIndex < images.length) {
      const timer = setTimeout(() => {
        setImageIndex((prev) => prev + 1);
      }, 1200);

      return () => clearTimeout(timer);
    } else {
      setShowQuote(true);
    }
  }, [accepted, imageIndex]);

  return (
    <div className="page">

      {/* 🎵 Music Button */}
      <button className="music-btn" onClick={toggleMusic}>
        {playing ? "🔊 Pause" : "🎵 Play"}
      </button>

      {/* 💕 Floating Hearts */}
      {accepted && <FloatingHearts />}

      {/* QUESTION SCREEN */}
      {!accepted && (
        <>
          <h1 className="title">Will you be my Valentine? 💖</h1>

          <div className="buttons">
            <button
              className="btn yes"
              onClick={() => {
                blastConfetti();
                playMusicSmoothly();
                setAccepted(true);
              }}
            >
              Yes ❤️
            </button>

            <button
              className="btn no"
              onMouseEnter={moveNo}
              style={noStyle}
            >
              No 💔
            </button>
          </div>
        </>
      )}

      {/* 🖼️ IMAGE BLAST */}
      {accepted && !showQuote && imageIndex < images.length && (
        <div className="image-stage">
          <img
            src={images[imageIndex]}
            alt="memory"
            className="blast-img limited"
          />
        </div>
      )}

      {/* 💌 FINAL FRAME + CENTERED QUOTE */}
      {showQuote && (
        <div className="final-stage">

          {/* TOP */}
          <div className="frame top">
            {images.slice(0, 3).map((img, i) => (
              <img key={i} src={img} className="memory-img" data-pos="top" />
            ))}
          </div>

          {/* LEFT */}
          <div className="frame left">
            <img src={images[3]} className="memory-img" data-pos="left" />
          </div>

          {/* RIGHT */}
          <div className="frame right">
            <img src={images[4]} className="memory-img" data-pos="right" />
          </div>

          {/* BOTTOM */}
          <div className="frame bottom">
            {images.slice(5).map((img, i) => (
              <img key={i} src={img} className="memory-img" data-pos="bottom" />
            ))}
          </div>

          {/* ⭐ CENTER QUOTE */}
          <div className="quote center-quote">
            <h1>Thank you for choosing me ❤️</h1>
            <p>
              I choose you to keep in my heart 🤍
              <br />
              now, tomorrow and forever. 💫
            </p>
          </div>

        </div>
      )}
    </div>
  );
}

/* 💕 Floating Hearts */
function FloatingHearts() {
  return (
    <div className="hearts">
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i}>❤️</span>
      ))}
    </div>
  );
}

export default App;
