const WorkCard = ({ index, title, description, image, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="
        group 
        relative 
        bg-white 
        rounded-2xl 
        overflow-hidden
        cursor-pointer
        transition-all 
        duration-500 
        hover:-translate-y-2 
        hover:shadow-2xl
      "
    >
      {/* Image: fixed height + object-contain to prevent any cropping */}
      <div
        className="relative overflow-hidden"
        style={{
          height: "220px",
          background: "#f5f5f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={image}
          alt={title}
          className="transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title + Index */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h3>

          <span className="text-xs text-gray-400 font-mono">
            {String(index).padStart(2, "0")}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-500 font-light">
          {description}
        </p>

        {/* Explore */}
        <div className="mt-6 flex items-center gap-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-gray-900">
            Explore Project
          </span>

          <div
            className="
            h-[1px] 
            w-8 
            bg-gray-900 
            transition-all 
            duration-300 
            group-hover:w-14
          "
          />

          <svg
            className="
              w-4 h-4 
              -translate-x-2 
              opacity-0 
              transition-all 
              duration-300 
              group-hover:translate-x-0 
              group-hover:opacity-100
            "
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WorkCard;
