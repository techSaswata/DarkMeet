export default function X_Icons(props) {
  // Forward any props (className, style, aria-*, etc.) to the SVG so
  // utility classes like `h-5 w-5` and `text-*` affect the icon.
  // Use `fill="currentColor"` so `text-color` utilities control the SVG color.
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="currentColor"
    >
      <path d="M357.2 48L427.8 48 273.6 224.2 455 464 313 464 201.7 318.6 74.5 464 3.8 464 168.7 275.5-5.2 48 140.4 48 240.9 180.9 357.2 48zM332.4 421.8l39.1 0-252.4-333.8-42 0 255.3 333.8z" />
    </svg>
  );
}
