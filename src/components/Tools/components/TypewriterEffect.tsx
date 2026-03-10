import { useEffect, useState } from "react";

interface TypewriterEffectProps {
  text: string;
  speed?: number;
}

export default function TypewriterEffect({
  text,
  speed = 20,
}: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
  }, [text]);

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [displayedText, text, speed]);

  return <>{displayedText}</>;
}
