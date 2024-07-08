import React, { useState } from "react";
import { useSpring, useSprings, animated, interpolate } from "react-spring";
import "./StackButton.scss";
import PropTypes from "prop-types";

const StackButton = ({ image, background, title, onPress }) => {
  const [open, setOpen] = useState(false);
  const { f, r } = useSpring({ f: open ? 0 : 1, r: open ? -3 : 3 });
  const cards = useSprings(
    5,
    [0, 1, 2, 3, 4].map((i) => ({ opacity: 0.2 + i / 5, z: open ? (i / 5) * 80 : 0 }))
  );
  return (
    <div
      onClick={onPress}
      className="stackContainer"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {cards.map(({ z, opacity }, index) => (
        <animated.div
          key={index}
          style={{
            opacity,
            background,
            transform: interpolate(
              [z, f.interpolate([0, 0.2, 0.6, 1], [0, index, index, 0]), r],
              (z, f, r) => `translate3d(0,0,${z}px) rotateX(${f * r}deg)`
            ),
          }}
        >
          {index === 4 && (
            <animated.img style={{ transform: f.interpolate([0, 1], ["scale(0.7)", "scale(1)"]) }} src={image} />
          )}
          <div className="subItemTitle">{title}</div>
        </animated.div>
      ))}
    </div>
  );
};

StackButton.propTypes = {
  image: PropTypes.string,
  background: PropTypes.string,
  title: PropTypes.string,
  onPress: PropTypes.func,
};

export default StackButton;
