export default function TextSplitter({
  text,
  type = "word",
  className = "",
  style1 = false,
}) {
  let items =
    type === "char"
      ? text.split("")
      : type === "line"
      ? text.split("\n")
      : text.split(" ");
  // items logged removed
  className = className + " inline-block mb-[-1rem] ";
  return (
    <>
      {items.map((item, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span
            className={className}
            style={
              style1
                ? {
                    transformOrigin: "center bottom",
                    transformStyle: "preserve-3d",
                    translate: "none",
                    rotate: "none",
                    scale: "none",
                    opacity: 0,
                    transform: "translateY(100%) rotateX(-15deg)",
                  }
                : {}
            }
          >
            {item + "\u00A0"}
          </span>
        </span>
      ))}
    </>
  );
}
