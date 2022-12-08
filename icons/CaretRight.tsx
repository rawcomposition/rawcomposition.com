import React from "react";

type Props = {
  className?: string;
};

export default function CaretRight({ className }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" className={`icon ${className || ""}`}>
      <path d="M224 256c0 1.1-.7344 3.969-2.219 5.531l-144 151.1c-3.047 3.187-8.125 3.312-11.31 .25c-3.188-3.094-3.281-8.156-.25-11.31l138.7-146.5L66.21 109.5C63.18 106.3 63.27 101.3 66.46 98.22c3.188-3.062 8.266-2.937 11.31 .25l144 151.1C223.3 252 224 254 224 256z" />
    </svg>
  );
}
