const Play = ({ color }) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 256 256"
      className="text-7xl text-white/60"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm35.33-95-48-32A6,6,0,0,0,106,96v64a6,6,0,0,0,9.33,5l48-32a6,6,0,0,0,0-10ZM118,148.79V107.21L149.18,128Z"
        fill={color}
      />
    </svg>
  );
};

export default Play;
