import InfoIconCircle from "../InfoIconCircle";

const socialLinks = [
  {
    href: "https://www.instagram.com/thebalidreamvilla",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/thebalidreamvilla",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "https://thebalidreamvilla.com",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    href: "http://wa.me/6287806514620",
    icon: (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.52 3.48A11.78 11.78 0 0 0 12.01 0C5.38 0 .02 5.36.02 11.99c0 2.11.55 4.17 1.6 5.99L0 24l6.19-1.62a11.9 11.9 0 0 0 5.82 1.48h.01c6.63 0 12-5.36 12-11.99 0-3.2-1.25-6.2-3.5-8.39zM12 21.5c-1.8 0-3.56-.48-5.1-1.38l-.36-.21-3.67.96.98-3.58-.23-.37a9.4 9.4 0 0 1-1.45-5c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.76a9.38 9.38 0 0 1 2.77 6.67c0 5.2-4.24 9.44-9.45 9.44zm5.17-7.12c-.28-.14-1.66-.82-1.92-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.22-1.36-.82-.73-1.37-1.63-1.53-1.91-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.09-.19.05-.35-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.55-.47-.47-.64-.48h-.55c-.19 0-.5.07-.76.35s-1 1-.96 2.43c.05 1.43 1.02 2.81 1.16 3 .14.19 2 3.05 4.85 4.27.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.66-.68 1.9-1.34.23-.66.23-1.23.16-1.34-.07-.12-.26-.19-.54-.33z" />
  </svg>
  )
  }
];

export default function FollowUsSection({ labelStyle, visible }) {
  return (
    <section className={`bali-up d5 ${visible ? "on" : ""} border-t border-[rgba(255,240,210,0.08)] pt-[32px]`}>
      <p className="label-jost">Follow Us</p>
      <div className="flex gap-[10px] items-center">
        {socialLinks.map(({ label, icon, href }, i) => (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[12px]"
          >
            <InfoIconCircle>{icon}</InfoIconCircle>
            <p className="font-jost text-[12.5px] font-[300] text-[rgba(230,210,180,0.88)]">
              {label}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
