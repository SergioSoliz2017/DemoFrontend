import { useEffect, useState } from "react";

export default function Avatar2D({ speaking }) {
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    let interval;

    if (speaking) {
      interval = setInterval(() => {
        setMouthOpen((prev) => !prev);
      }, 150);
    } else {
      setMouthOpen(false);
    }

    return () => clearInterval(interval);
  }, [speaking]);

  return (
    <div
      style={{
        position: "relative",
        width: 300,
        height: 400,
      }}
    >
      {/* Cara */}
      <img
        src="/avatar/avatar-base.png"
        alt="avatar"
        style={{
          width: "100%",
          position: "absolute",
        }}
      />
      {/* Boca */}
      <img
        src={
          mouthOpen
            ? "/avatar/mouth-open.png"
            : "/avatar/mouth-closed.png"
        }
        alt="mouth"
        style={{
          width: 120,
          position: "absolute",
          bottom: mouthOpen ? 122 : 139,
          left: "100%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
}