import React from 'react';

interface TopographicBgProps {
  className?: string;
}

export const TopographicBg: React.FC<TopographicBgProps> = ({ className = '' }) => {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 900"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none select-none ${className}`}
    >
      {/* Left Perimeter Topographic Contours */}
      <g stroke="#38BDF8" strokeOpacity="0.34" strokeWidth="1.25">
        <path d="M-40 120 C 40 100, 95 160, 145 140 C 195 120, 170 40, 230 -10" />
        <path d="M-40 165 C 55 140, 110 210, 175 185 C 240 160, 215 65, 290 0" />
        <path d="M-40 215 C 70 190, 130 270, 210 235 C 280 205, 260 105, 345 15" />
        <path d="M-30 580 C 60 540, 140 610, 170 680 C 200 750, 90 810, 140 910" />
        <path d="M-40 640 C 40 605, 105 660, 125 725 C 145 790, 50 845, 80 910" />
      </g>
      <g stroke="#1E4E79" strokeOpacity="0.65" strokeWidth="1.2">
        <path d="M-40 270 C 90 245, 155 330, 240 285 C 320 240, 310 130, 400 25" />
        <path d="M-40 340 C 50 325, 115 390, 150 450 C 185 510, 80 535, 35 600" />
        <path d="M180 780 C 230 740, 310 755, 345 815 C 380 875, 305 920, 250 920" />
      </g>

      {/* Right Perimeter Topographic Contours */}
      <g stroke="#38BDF8" strokeOpacity="0.34" strokeWidth="1.25">
        <path d="M1140 -10 C 1185 75, 1110 155, 1180 210 C 1250 265, 1345 190, 1470 235" />
        <path d="M1210 -10 C 1255 60, 1185 135, 1245 185 C 1305 235, 1385 160, 1470 190" />
        <path d="M1480 460 C 1370 435, 1315 515, 1340 595 C 1365 675, 1275 735, 1190 770 C 1105 805, 1140 885, 1085 920" />
        <path d="M1480 535 C 1395 515, 1365 580, 1385 645 C 1405 710, 1315 765, 1250 805 C 1195 840, 1215 895, 1170 920" />
      </g>
      <g stroke="#1E4E79" strokeOpacity="0.65" strokeWidth="1.2">
        <path d="M1060 -15 C 1115 85, 1045 185, 1130 250 C 1215 315, 1320 245, 1470 295" />
        <path d="M1480 375 C 1360 355, 1275 435, 1295 530 C 1315 625, 1220 680, 1130 725 C 1040 770, 1070 865, 1015 920" />
        <path d="M1480 620 C 1420 610, 1395 660, 1410 715 C 1425 770, 1340 820, 1310 915" />
      </g>

      {/* Subtle Closed Contour Islands */}
      <g stroke="#38BDF8" strokeOpacity="0.25" strokeWidth="1.1">
        <path d="M90 430 C 115 405, 165 420, 160 455 C 155 490, 95 495, 78 468 C 65 448, 75 440, 90 430 Z" />
        <path d="M1285 320 C 1325 295, 1385 315, 1378 355 C 1371 395, 1300 400, 1278 368 C 1265 348, 1268 332, 1285 320 Z" />
        <path d="M510 855 C 545 835, 605 845, 600 878 C 595 905, 535 910, 505 888 C 490 876, 495 864, 510 855 Z" />
      </g>
    </svg>
  );
};
