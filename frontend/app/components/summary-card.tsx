import type { ComponentType } from "react";

type SummaryMetricCardProps = {
  label: string;
  value: string;
  detail: string;
  progress: number;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  barColor: string;
};

export function SummaryMetricCard({
  label,
  value,
  detail,
  progress,
  icon: Icon,
  iconColor,
  badgeBg,
  badgeText,
  barColor,
}: SummaryMetricCardProps) {
  return (
    <div
      className="
        min-w-0
        w-[50%]
        md:w-full
        px-2
        py-3
        sm:py-5
        lg:py-5
        animate-fade-in-metric
      "
    >
      {/* TÍTULO */}
      <p
        className="
          text-[12px]
          font-semibold
          leading-tight
          text-[#F2F8FB]

          sm:text-[15px]
          text-center
          md:text-start
          lg:text-[18px]
          pb-2
          md:pb-4

        "
      >
        {label}
      </p>

      {/* VALOR + ÍCONE */}
      <div
        className="
          mt-1
          flex
          items-center
          justify-center
          md:justify-start
          gap-1.5
          sm:gap-2
        "
      >
        <span
          className="
            text-[18px]
            font-bold
            leading-none
            text-white

            sm:text-[20px]
          "
        >
          {value}
        </span>

        <Icon
          className={`
            h-3.5
            w-3.5
            shrink-0

            sm:h-4
            sm:w-4

            ${iconColor}
          `}
        />
      </div>

      {/* BADGE */}
      <div className="flex justify-center md:block mt-2 min-w-0">
        <span
          className={`
          
            inline-flex
            max-w-full
            rounded-xs
            md:rounded-sm
            px-1.5
            py-[2px]

            text-[7px]
            font-medium

            sm:px-2
            sm:py-[3px]
            sm:text-[9px]

            md:text-[10px]

            ${badgeBg}
            ${badgeText}
          `}
        >
          <span className="truncate">
            {detail}
          </span>
        </span>
      </div>

      {/* BARRA - escondida no mobile */}
      <div
        className="
          hidden
          w-[90%]
          overflow-hidden
          rounded-[3px]
          bg-[#08324A]

          sm:block
          sm:mt-4
          lg:h-[10px]
        "
      >
        <div
          className={`
            h-full
            rounded-l-[3px]
            transition-[width]
            duration-500
            ease-out

            ${barColor}
          `}
          style={{
            width: `${Math.min(
              Math.max(progress, 0),
              100
            )}%`,
          }}
        />
      </div>
    </div>
  );
}