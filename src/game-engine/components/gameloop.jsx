// /game-engine/components/GameLoop.js
import React, { useRef, useEffect, useCallback } from 'react';
import Timer from './timer';

const GameLoop = ({ running = true, onUpdate, children, style = {}, className }) => {
  const timer = useRef(new Timer());
  const containerRef = useRef();
  const input = useRef([]);
  const previousTime = useRef(null);
  const previousDelta = useRef(null);

  const updateHandler = useCallback((currentTime) => {
    const delta = currentTime - (previousTime.current || currentTime);

    const args = {
      input: input.current,
      window,
      time: {
        current: currentTime,
        previous: previousTime.current,
        delta,
        previousDelta: previousDelta.current
      }
    };

    if (onUpdate) onUpdate(args);

    input.current = [];
    previousTime.current = currentTime;
    previousDelta.current = delta;
  }, [onUpdate]);

  useEffect(() => {
    const timerInstance = timer.current;
    timerInstance.subscribe(updateHandler);
    if (running) timerInstance.start();

    return () => {
      timerInstance.unsubscribe(updateHandler);
      timerInstance.stop();
    };
  }, [running, updateHandler]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

  const handleInput = (name) => (e) => {
    e.persist();
    input.current.push({ name, payload: e });
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={className}
      style={{ ...styles.container, ...style }}
      onKeyDown={handleInput('onKeyDown')}
      onKeyUp={handleInput('onKeyUp')}
      onMouseDown={handleInput('onMouseDown')}
      onMouseUp={handleInput('onMouseUp')}
      onMouseMove={handleInput('onMouseMove')}
    >
      {children}
    </div>
  );
};

const styles = {
  container: {
    outline: 'none',
    flex: 1,
    width: '100%',
    height: '100%',
  }
};

export default GameLoop;
