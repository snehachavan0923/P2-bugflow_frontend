const StatCard = ({
  title,
  value,
  icon,
  color
}) => {

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        p-6
        hover:shadow-md
        transition
      "
    >
      <div className="flex justify-between">

        <div>

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            {title}
          </p>

          <h2
            className="
              text-4xl
              font-bold
              mt-3
            "
          >
            {value}
          </h2>

        </div>

        <div
          className={`
            h-12
            w-12
            rounded-xl
            flex
            items-center
            justify-center
            ${color}
          `}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default StatCard;