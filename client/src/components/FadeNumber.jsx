import React from "react";
import { useSpring, animated } from "react-spring";

const FadeNumberWhite = React.memo(({ value }) => {
  const style = useSpring({
    from: { color: "white", fontWeight: "bold", fontSize: "24px" },
    to: { color: "#658D8C", fontWeight: "normal", fontSize: "16px" },
    delay: 4000
  });

  return <animated.span style={style}>{value}</animated.span>;
});

const FadeNumberRed = React.memo(({ value }) => {
  const style = useSpring({
    from: { color: "red", fontWeight: "bold", fontSize: "24px" },
    to: { color: "#658D8C", fontWeight: "normal", fontSize: "16px" },
    delay: 4000
  });

  return <animated.span style={style}>{value}</animated.span>;
});

export { FadeNumberRed, FadeNumberWhite };
