import React, { useState, useEffect } from "react";

export const CountdownTimer = (props: { startSeconds: number }) => {
  const [time, setTime] = useState(props.startSeconds);

  useEffect(() => {
    setTimeout(() => setTime(Math.max(time - 1, 0)), 1000);
  }, [time]);

  return <>{time}s</>;
};
