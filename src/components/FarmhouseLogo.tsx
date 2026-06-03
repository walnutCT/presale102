/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import brandLogo from '../assets/images/LogoFH_1080X1080px-02_0.jpg';

export default function FarmhouseLogo() {
  return (
    <div className="flex items-center justify-center overflow-hidden rounded shadow-sm hover:scale-[1.02] transition-transform">
      <img
        src={brandLogo}
        alt="Farmhouse Logo"
        className="w-[164px] h-[64px] object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

