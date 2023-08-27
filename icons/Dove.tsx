import React from "react";

type Props = {
  className?: string;
};

export default function Dove({ className }: Props) {
  return (
    <svg
      viewBox="0 0 8503 8503"
      version="1.1"
      className={`${className || ""}`}
      style={{ fill: "currentColor" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="matrix(4.16667,0,0,4.16667,-1667,-1769)">
        <path d="M2302.58,1379.74C2281.87,1388.22 2270.11,1398.06 2261.89,1409.39C2179.03,1523.61 2244.61,1628.94 2116.19,1805.61C2014.03,1946.15 1858.16,2023.49 1675.82,2045.94C1564.67,2063.55 1461.5,2075.25 1366.31,2081.02C977.203,2183.54 712.403,2252.32 571.908,2287.37C531.714,2296.96 509.704,2294.89 505.876,2281.18C437.37,2295.66 407.639,2262.68 421.122,2239.94C678.999,2098.16 720.219,2107.01 907.189,1989.73C1073.61,1898.23 1198.75,1810.77 1282.63,1727.37C1240.07,1721.77 1207.77,1703.19 1185.71,1671.6C1100.88,1675.87 1046.12,1643.19 1021.46,1573.55C938.799,1572.33 886.887,1534.56 865.718,1460.26C802.476,1459.66 752.875,1421.22 716.916,1344.93C751.997,1346.65 788.326,1341.43 825.901,1329.26C705.721,1319.52 639.9,1272.76 628.438,1188.99C675.492,1195.32 717.732,1193.99 755.156,1185.01C643.791,1155.14 590.727,1100.34 595.956,1020.61C682.536,1041.86 754.147,1056.16 810.794,1063.5C977.331,1072.67 1135.84,1092.76 1286.33,1123.75C1245.83,1078.33 1239.25,1028.66 1266.58,974.739C1227.24,937.619 1218.44,884.67 1240.19,815.899C1261.21,837.358 1287.05,855.185 1317.7,869.381C1247.93,793.442 1233.78,725.854 1275.26,666.612C1301.12,697.922 1328.4,721.629 1357.11,737.735C1304.57,654.285 1303.09,589.061 1352.7,542.061C1394.69,605.699 1431.34,656.281 1462.62,693.798C1663.81,901.709 1818.2,1118.61 1925.83,1344.49L1928.54,1343.9C1992.12,1229.11 2073.63,1172.37 2173.05,1173.67C2309.87,1175.51 2286.29,1260.68 2321.73,1314.78C2328.2,1324.66 2336.91,1332.51 2351.27,1334.94C2364,1337.1 2413.06,1335.24 2416.67,1351.4C2418.48,1359.5 2310.27,1376.58 2302.57,1379.74L2302.58,1379.74Z" />
      </g>
    </svg>
  );
}