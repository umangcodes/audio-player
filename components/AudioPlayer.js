import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/AudioPlayer.module.css";
import { BsArrowLeftShort } from "react-icons/bs";
import { BsArrowRightShort } from "react-icons/bs";
import { FaPlay, FaPause } from "react-icons/fa";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const audioPlayer = useRef();
  const progressBar = useRef();
  const [currentTime, setCurrentTime] = useState(0);

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };
  const animationRef = useRef();
  const togglePlay = async () => {
    await setIsPlaying((prevState) => !prevState);
    if (isPlaying) {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };
  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${progressBar.current.value / duration}%`
    );
    setCurrentTime(progressBar.current.value);
  };
  const calTime = (secs) => {
    const min = Math.floor(secs / 60);
    const returnedMins = min < 10 ? `0${min}` : `${min}`;
    const seconds = Math.floor(secs % 60);
    const returnedSecs = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMins}:${returnedSecs}`;
  };
  const backThirty = () => {
    progressBar.current.value = Number(
      progressBar.current.value - 30 < 0
        ? (progressBar.current.value = 0)
        : progressBar.current.value - 30
    );
    changeRange();
  };
  const forwardThirty = () => {
    progressBar.current.value = Number(
      progressBar.current.value + 30 > duration
        ? (progressBar.current.value = duration)
        : progressBar.current.value + 30
    );
    changeRange();
  };
  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);
  return (
    <div>
      <div className={styles.audioPlayer}>
        <audio
          ref={audioPlayer}
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          preload="metadata"
        />
        <button className={styles.forwardBackward} onClick={backThirty}>
          <BsArrowLeftShort /> 30
        </button>
        <button onClick={togglePlay} className={styles.playPause}>
          {isPlaying ? <FaPause /> : <FaPlay className={styles.play} />}
        </button>
        <button className={styles.forwardBackward} onClick={forwardThirty}>
          <BsArrowRightShort /> 30
        </button>
        <div>
          <div className={styles.currentTime}>{calTime(currentTime)}</div>
          <div>
            <input
              type="range"
              className={styles.progressBar}
              defaultValue="0"
              ref={progressBar}
              onChange={changeRange}
            />
          </div>
          <div className={styles.duration}>
            {duration && !isNaN(duration) && calTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export { AudioPlayer };
