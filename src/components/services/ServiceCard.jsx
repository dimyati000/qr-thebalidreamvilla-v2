export default function ServiceCard({
  name,
  subtitle,
  Icon,
  isVisible,
  delayClass,
  onClick,
  className, // Tambahkan ini agar bisa menerima class dari luar
}) {
  return (
    <div
      className={`svc-card svc-up ${delayClass} ${isVisible ? "on" : ""} 
        p-[18px] pt-[20px] px-[16px] 
        flex flex-col items-center text-center 
        gap-[12px] cursor-pointer hover:scale-[1.03] transition duration-300
        hover:bg-white/10 
        bg-white/5 backdrop-blur-md
        border border-white/10
        rounded-xl
        justify-center
        ${className} // Gabungkan di sini
      `}
      onClick={onClick}
    >
      <div
        className="
          icon-wrap 
          w-[42px] h-[42px] 
          rounded-full 
          bg-[rgba(255,240,210,0.1)] 
          border-[0.5px] border-[rgba(255,240,210,0.16)] 
          flex items-center justify-center 
          text-[rgba(218,188,145,0.92)]
          flex-shrink-0
        "
      >
        <Icon />
      </div>

      <div className="flex flex-col items-center">
        <p className="svc-card-name uppercase font-bold text-[12px] leading-tight mb-1">{name}</p>
        <p className="svc-card-subtitle text-[10px] opacity-60 leading-tight">{subtitle}</p>
      </div>
    </div>
  );
}