/**
 * ============================================================================
 *  CHURCH CONFIGURATION
 * ============================================================================
 *
 *  This is the ONLY file most churches need to edit when forking this template.
 *
 *  Fill in your church's details below. For assets (logo, images), replace the
 *  files inside `public/assets/images/` keeping the same filenames, or update
 *  the filenames here.
 *
 *  For the deployment base path (used by GitHub Pages), set the
 *  `NEXT_PUBLIC_BASE_PATH` environment variable instead of editing this file.
 *  See README.md and SETUP.md for full instructions.
 * ============================================================================
 */

export interface ServiceSchedule {
  /** Display name of the service, e.g. "Kebaktian Sabat (Hybrid)" */
  name: string;
  /** Display time of the service, e.g. "09.00 WIB" */
  time: string;
}

export interface ChurchConfig {
  /** Full church name shown in the browser tab, footer, navbar, etc. */
  name: string;
  /** Short/brand name shown in the navbar. Often the same as `name`. */
  shortName: string;
  /** Meta description used for SEO in the <head>. */
  description: string;

  /** Homepage hero heading, e.g. "Selamat Datang di <church>". */
  welcomeHeading: string;
  /** Homepage hero subtitle text. */
  welcomeSubtitle: string;

  /** Asset filenames located in `public/assets/images/`. */
  assets: {
    logo: string;
    zoomLogo: string;
    birthdayHeader: string;
  };

  /** Homepage worship service schedule cards. */
  services: ServiceSchedule[];

  /** Zoom / online meeting details. */
  zoom: {
    /** Human-readable meeting id, e.g. "987 654 1988". */
    id: string;
    /** Meeting password. */
    password: string;
    /** Full join URL. */
    url: string;
  };

  /** Social media (Instagram). */
  instagram: {
    /** Handle as displayed, e.g. "@yourchurch". */
    handle: string;
    /** Full profile URL. */
    url: string;
  };

  /** Google Maps embed URL (the `src` of the embed iframe). */
  mapsEmbedUrl: string;

  /** Announcements: Canva design embed URL for the pengumuman page. */
  pengumumanEmbedUrl: string;

  /** Google Sheets data sources. */
  sheets: {
    /**
     * Worship schedule (jadwal pelayanan) — the sheet that lists who serves
     * in which role for each Saturday. A new spreadsheet is used each quarter,
     * so update both `sheetId` and `gid` (the participants tab) accordingly.
     */
    schedule: {
      sheetId: string;
      /** gid of the participants tab within the quarter's spreadsheet. */
      gid: string;
    };
    /**
     * Kertas Acara / Lagu Sion sheet — holds the worship order details and
     * the hymnal (Lagu Sion) number-to-title lookup. These live in two tabs
     * of the same spreadsheet, identified by their gid.
     */
    liturgy: {
      sheetId: string;
      /** gid of the "kertas acara" tab. */
      kertasAcaraGid: string;
      /** gid of the "Lagu Sion" (hymnal lookup) tab. */
      laguSionGid: string;
    };
    /**
     * Birthday (ulang tahun) sheet — congregation member birthdays. The data
     * is split across multiple tabs (roughly one per month, though rows are
     * not strictly grouped by birth month). All tabs are fetched and merged;
     * each person's birth month/day is read from their own row columns.
     */
    birthdays: {
      sheetId: string;
      /** gids of every tab that holds birthday rows. */
      tabGids: string[];
    };
  };

  /**
   * Kertas Acara liturgy configuration. This is tightly coupled to your
   * church's own worship order and the structure of your schedule sheet.
   * See SETUP.md for the expected sheet layout.
   */
  kertasAcara: {
    /**
     * Prefix used when displaying a hymn, e.g. "LSEL" for
     * "Lagu Sion Edisi Lengkap". Rendered as "<prefix> <number> | <title>".
     */
    hymnalPrefix: string;
    /** Fixed hymn numbers used at set points in the worship order. */
    fixedHymns: {
      laguPartisipanKhotbah: string;
      laguSambutan1: string;
      laguSambutanKhotbah: string;
      laguSambutan2: string;
    };
    /** Static text shown for the "Pengumuman" slot in Sekolah Sabat. */
    pengumumanRole: string;
    /**
     * Downloadable JPG export of the worship order. The app proxies Google
     * Sheets' native PDF export of the given cell range and converts it to a
     * JPG in the browser. Requires the liturgy spreadsheet to be publicly
     * viewable ("Anyone with the link").
     */
    export: {
      sheetId: string;
      gid: string;
      /** Cell range to export, e.g. "B10:P70". */
      range: string;
    };
    /**
     * Keywords used to classify rows in the schedule sheet into sections.
     * All comparisons are case-insensitive. Adjust these to match the exact
     * role labels used in your church's schedule spreadsheet.
     */
    parsing: {
      /** Rows whose role contains any of these are skipped entirely. */
      skipRoleKeywords: string[];
      /** A row whose role contains this marks the start of the SS section. */
      ssSectionMarker: string;
      /** A row whose role contains this marks the start of the Khotbah section. */
      khotbahSectionMarker: string;
      /** Role keywords that classify a row into the Diakonia section. */
      diakoniaKeywords: string[];
      /** Role keywords that classify a row into the Pelayanan Musik section. */
      pelayananKeywords: string[];
      /** Role keywords that mark a role as filled by two people. */
      multiPersonKeywords: string[];
      /**
       * The rotating "Dorongan" role. When a role matches `matchKeyword` AND
       * any of `subKeywords`, its display label rotates by the Saturday number
       * of the month according to `rotation`.
       */
      dorongan: {
        matchKeyword: string;
        subKeywords: string[];
        /** Map of Saturday-of-month number (1-5) to display label. */
        rotation: Record<number, string>;
      };
    };
  };
}

// ---------------------------------------------------------------------------
//  EDIT THE VALUES BELOW FOR YOUR CHURCH.
//
//  Placeholders like "YOUR_..._SHEET_ID" must be replaced with your own data.
//  See README.md for a field-by-field walkthrough and SETUP.md for the exact
//  Google Sheets layout the app expects.
// ---------------------------------------------------------------------------
export const churchConfig: ChurchConfig = {
  // --- Branding -----------------------------------------------------------
  name: "Your Church Name",
  shortName: "Your Church",
  description: "Official website of Your Church.",

  welcomeHeading: "Selamat Datang di Your Church",
  welcomeSubtitle:
    "Bergabunglah dengan kami dalam perjalanan iman, komunitas, dan pelayanan.",

  // --- Assets (files inside public/assets/images/) ------------------------
  assets: {
    logo: "logo.svg",
    zoomLogo: "zoom-logo.svg",
    birthdayHeader: "balloons.svg",
  },

  // --- Homepage worship service cards -------------------------------------
  services: [
    { name: "Rabu Malam & Vesper (Online)", time: "07.00 WIB" },
    { name: "Kebaktian Sabat (Hybrid)", time: "09.00 WIB" },
  ],

  // --- Zoom / online meeting ----------------------------------------------
  zoom: {
    id: "000 0000 0000",
    password: "000000",
    url: "https://zoom.us/j/0000000000",
  },

  // --- Social media --------------------------------------------------------
  instagram: {
    handle: "@yourchurch",
    url: "https://www.instagram.com/yourchurch/",
  },

  // --- Google Maps embed (the `src` of the "Embed a map" iframe) ----------
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=YOUR_MAPS_EMBED",

  // --- Announcements (Canva design embed URL) -----------------------------
  pengumumanEmbedUrl: "https://www.canva.com/design/YOUR_CANVA_ID/view?embed",

  // --- Google Sheets data sources (must be publicly viewable) -------------
  sheets: {
    schedule: {
      sheetId: "YOUR_SCHEDULE_SHEET_ID",
      gid: "0",
    },
    liturgy: {
      sheetId: "YOUR_LITURGY_SHEET_ID",
      kertasAcaraGid: "0",
      laguSionGid: "0",
    },
    birthdays: {
      sheetId: "YOUR_BIRTHDAYS_SHEET_ID",
      // One gid per tab that holds birthday rows (add or remove as needed).
      tabGids: ["0"],
    },
  },

  // --- Kertas Acara liturgy ------------------------------------------------
  kertasAcara: {
    // "LSEL" = Lagu Sion Edisi Lengkap (Indonesian SDA hymnal). Change to your
    // hymnal's abbreviation.
    hymnalPrefix: "LSEL",
    // Hymn numbers sung at fixed points in the worship order.
    fixedHymns: {
      laguPartisipanKhotbah: "421",
      laguSambutan1: "21",
      laguSambutanKhotbah: "524",
      laguSambutan2: "168",
    },
    pengumumanRole: "Dept. Komunikasi, Ketua Jemaat",
    // Downloadable JPG of the worship order (the "Unduh Kertas Acara" button).
    export: {
      sheetId: "YOUR_LITURGY_SHEET_ID",
      gid: "0",
      range: "B10:P70",
    },
    // Keywords that classify rows of the schedule sheet into sections.
    // These defaults follow common Indonesian SDA conventions; adjust to your
    // sheet's exact row labels. See SETUP.md.
    parsing: {
      skipRoleKeywords: ["penyedia potluck", "koordinator"],
      ssSectionMarker: "DEWASA",
      khotbahSectionMarker: "KHOTBAH",
      diakoniaKeywords: ["diakon", "diakones", "bwa"],
      pelayananKeywords: ["pelayanan musik", "pianist", "keyboardist"],
      multiPersonKeywords: ["diakon persembahan", "diakones", "bwa"],
      dorongan: {
        matchKeyword: "dor",
        subKeywords: ["pp", "rt", "kesehatan"],
        rotation: {
          1: "Dorongan PP",
          2: "Rumah Tangga",
          3: "Dorongan PP",
          4: "Kesehatan",
          5: "Dorongan PP",
        },
      },
    },
  },
};

export default churchConfig;
