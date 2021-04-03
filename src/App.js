import "./App.css";

import React, { useState } from "react";

const App = () => {
  const [displayTinme, setdisplayTinme] = useState(5);
  const [breakTime, setbreakTime] = useState(3);
  const [sessionTime, setsessionTime] = useState(5);
  const [timerOn, settimerOn] = useState(false);
  const [onBreak, setonBreak] = useState(false);
  const [breakAudio, setbreakAudio] = useState(new Audio("boop.mp3"));

  const playAlarmSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  };

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakTime <= 60 && amount < 0) {
        return;
      }
      setbreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) {
        return;
      }
      setsessionTime((prev) => prev + amount);
      if (!timerOn) {
        setdisplayTinme(sessionTime + amount);
      }
    }
  };

  const reset = () => {
    setdisplayTinme(25 * 60);
    setbreakTime(5 * 60);
    setsessionTime(25 * 60);
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setdisplayTinme((prev) => {
            if (prev <= 0 && !onBreak) {
              playAlarmSound();
              onBreakVariable = true;
              setonBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreak) {
              playAlarmSound();
              onBreakVariable = false;
              setonBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);

      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    settimerOn(!timerOn);
    console.log(onBreak);
  };

  return (
    <div className="center-align">
      <h2>Oscar Dario's Productivity clock</h2>
      <div className="dual-container">
        <Duration
          title={"break duration"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
        ></Duration>
        <Duration
          title={"session duration"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
        ></Duration>
      </div>
      <h4>{onBreak ? "We're on break" : "We're on session"}</h4>

      <h2>{formatTime(displayTinme)}</h2>
      <button
        className="btn-small light-blue lighten-3"
        onClick={() => controlTime()}
      >
        {timerOn ? (
          <i className="material-icons">pause_circle_filled</i>
        ) : (
          <i className="material-icons">play_circle_filled</i>
        )}
      </button>
      <button className="btn-small grey darken-4">
        <i className="material-icons" onClick={() => reset()}>
          autorenew
        </i>
      </button>
    </div>
  );
};

function Duration({ title, changeTime, type, time, formatTime }) {
  return (
    <div className="">
      <h4>{title}</h4>
      <div className="time-sets">
        <button
          className="btn-small grey darken-4"
          onClick={() => changeTime(-60, type)}
        >
          <i className="material-icons">arrow_downward</i>
        </button>
        <h4>{formatTime(time)}</h4>
        <button
          className="btn-small grey darken-4"
          onClick={() => changeTime(60, type)}
        >
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}

export default App;
