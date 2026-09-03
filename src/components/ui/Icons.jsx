/**
 * أيقونات مرسومة يدويًا بدل مكتبة جاهزة:
 * حِدّة الخط (1.6) ونهاياتها المستديرة مشتقّة من رشاقة رمز الطائر،
 * ما يجعلها جزءًا من الهوية لا إضافة غريبة عليها.
 */
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const Icon = ({ size = 20, children, ...rest }) => (
  <svg {...base} width={size} height={size} aria-hidden="true" focusable="false" {...rest}>
    {children}
  </svg>
);

export const IconRoster = (p) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
    <path d="M8 14h3M8 17.5h6" />
  </Icon>
);

export const IconSales = (p) => (
  <Icon {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="3" />
    <path d="M2.5 10h19" />
    <path d="M6.5 14.5h4" />
  </Icon>
);

export const IconLedger = (p) => (
  <Icon {...p}>
    <path d="M4 4.5h13a3 3 0 0 1 3 3V20H7a3 3 0 0 1-3-3V4.5Z" />
    <path d="M4 17a3 3 0 0 1 3-3h13" />
    <path d="M8.5 8.5h7" />
  </Icon>
);

export const IconUpload = (p) => (
  <Icon {...p}>
    <path d="M12 16V4" />
    <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
  </Icon>
);

export const IconDownload = (p) => (
  <Icon {...p}>
    <path d="M12 4v12" />
    <path d="m7.5 11.5 4.5 4.5 4.5-4.5" />
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </Icon>
);

export const IconBack = (p) => (
  <Icon {...p}>
    <path d="M5 12h14" />
    <path d="m11 6-6 6 6 6" />
  </Icon>
);

export const IconPlus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const IconTrash = (p) => (
  <Icon {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
    <path d="M6.5 7 7.5 19a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4L17.5 7" />
  </Icon>
);

export const IconCheck = (p) => (
  <Icon {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Icon>
);

export const IconAlert = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5M12 16h.01" />
  </Icon>
);

export const IconFile = (p) => (
  <Icon {...p}>
    <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-5.5-5.5Z" />
    <path d="M13.5 3.5V9H19" />
  </Icon>
);

export const IconChart = (p) => (
  <Icon {...p}>
    <path d="M4 20V9M10 20V4M16 20v-7M22 20H2" />
  </Icon>
);

export const IconOffline = (p) => (
  <Icon {...p}>
    <path d="M3 3l18 18" />
    <path d="M8.5 16.5a4 4 0 0 1 7 0" />
    <path d="M5 12.5a9 9 0 0 1 3.5-2.4M19 12.5a9 9 0 0 0-6.6-2.9" />
  </Icon>
);
