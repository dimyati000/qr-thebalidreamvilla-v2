import { forwardRef } from "react";

const FooterCopyright = forwardRef(function FooterCopyright({ visible }, ref) {
  return (
    <div>
      <p className="font-jost text-[9.5px] tracking-[2.5px] text-[rgba(175,148,108,0.45)] uppercase">
        © 2026 The Bali Dream Villa, All rights reserved.
      </p>
    </div>
  );
});

export default FooterCopyright;
