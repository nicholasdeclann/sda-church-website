# Google Sheets Setup Guide

This site reads all of its data from **public Google Sheets** at runtime using
Google's Visualization API (`gviz/tq`) and, for the download button, Google's
PDF export. **No API key or service account is required** — the sheets just need
to be shared as "Anyone with the link can view".

You need **three** spreadsheets, all configured in `src/config/church.ts` under
the `sheets` key (plus a small `kertasAcara.export` block):

1. A **schedule** spreadsheet — who serves in which role each Saturday.
2. A **liturgy** spreadsheet — worship-order details + the hymnal lookup.
3. A **birthdays** spreadsheet — congregation member birthdays.

---

## Finding a Sheet ID and a gid

For a URL like:

```
https://docs.google.com/spreadsheets/d/1AbCdEfG.../edit?gid=1234567890#gid=1234567890
                                       └── sheetId ──┘        └── gid ─┘
```

- **sheetId** — the long string between `/d/` and `/edit`.
- **gid** — the number after `gid=` (each tab has its own gid).

Make every spreadsheet viewable: **Share → General access → Anyone with the
link → Viewer**.

---

## 1. Schedule sheet — `sheets.schedule`

Drives the **Kertas Acara** page's participant assignments. Many churches use a
**new spreadsheet each quarter**, so this needs both a `sheetId` and the `gid`
of the participants tab:

```ts
schedule: { sheetId: "YOUR_SCHEDULE_SHEET_ID", gid: "636950867" }
```

When a new quarter starts, update both values — no code changes needed.

### Layout expectations

- **Row 1** is a header row where columns represent **dates** (Saturdays). The
  app matches the current/next Saturday by looking for the day + month text
  (e.g. `19 Sep`) in these header cells.
- **Column A** (index 0) holds the **role name** for each row.
- **Each date column** holds the **person** assigned to that role for that date.
- Data rows start at **row 5** (index 4); rows 2–4 are ignored.

### Sections

Rows are grouped into sections using marker rows and keywords, all configurable
under `kertasAcara.parsing` (comparisons are case-insensitive):

| Section | How it's detected (default keywords) |
|---------|--------------------------------------|
| Sekolah Sabat | Everything after a row whose role contains `DEWASA` (`ssSectionMarker`) |
| Khotbah | Everything after a row whose role contains `KHOTBAH` (`khotbahSectionMarker`) |
| Diakonia | Rows whose role contains `diakon`, `diakones`, or `bwa` (`diakoniaKeywords`) |
| Pelayanan Musik | Rows whose role contains `pelayanan musik`, `pianist`, or `keyboardist` (`pelayananKeywords`) |

Rows whose role contains any `skipRoleKeywords` (default: `penyedia potluck`,
`koordinator`) are ignored.

### Two-person roles

If a role matches `multiPersonKeywords` (default: `diakon persembahan`,
`diakones`, `bwa`), the app reads the **next row's** person (when that next row
has a blank role) as the second person.

### The rotating "Dorongan" role

One role rotates its label by which Saturday of the month it is. Configure it
under `kertasAcara.parsing.dorongan`:

- `matchKeyword` (default `dor`) **and** any of `subKeywords`
  (default `pp`, `rt`, `kesehatan`) must appear in the role text.
- `rotation` maps the Saturday-of-month number (1–5) to a display label, e.g.
  1st/3rd/5th → "Dorongan PP", 2nd → "Rumah Tangga", 4th → "Kesehatan".

### Row keys read by the section components

The section components look up rows by their **lowercased role text**. If your
sheet uses different labels, update the components in
`src/app/kertas-acara/components/`. The defaults expect keys such as:

- Sekolah Sabat: `pemimpin`, `ayat inti/doa buka ss`, `berita mission`,
  `kuis sekolah sabat`, `diskusi sekolah sabat`, `lagu pujian`,
  `dor. pp/rt/kesehatan`
- Khotbah: `doa syafaat`, `bacaan persembahan`, `pembicara`, `khotbah`,
  `cerita anak`, `lagu pujian` / `lagu pujian 1` / `lagu pujian 2`,
  `ayat bersahutan & inti`

---

## 2. Liturgy sheet — `sheets.liturgy` (+ `kertasAcara.export`)

One spreadsheet with two tabs, plus a download-export configuration.

```ts
liturgy: {
  sheetId: "YOUR_LITURGY_SHEET_ID",
  kertasAcaraGid: "1587228396",
  laguSionGid: "1174681408",
}
```

### a) Kertas Acara tab (`kertasAcaraGid`)

- **Column B** (index 1) holds a label, **column C** (index 2) the value, and
  **column J** (index 9) the Sekolah Sabat variant where relevant.
- Recognized labels (lowercased): `lagu buka`, `lagu tutup`, `judul khotbah`,
  `ayat inti`, `ayat bersahutan`.
  - `lagu buka` / `lagu tutup` — opening/closing hymn numbers (col C for the
    main service, col J for Sekolah Sabat).
  - `judul khotbah`, `ayat inti`, `ayat bersahutan` — text shown alongside the
    order of service.

### b) Lagu Sion tab (`laguSionGid`)

The hymnal lookup table:

- **Column B** (index 1) = hymn number
- **Column C** (index 2) = hymn title

Hymns display as `<hymnalPrefix> <number> | <title>` (e.g. `LSEL 421 | ...`).
Set `kertasAcara.hymnalPrefix` and the four `kertasAcara.fixedHymns` numbers to
match your hymnal and worship order.

### c) Download-as-JPG export — `kertasAcara.export`

The "Unduh Kertas Acara" button exports a cell range of the liturgy sheet as an
image. Configure which range:

```ts
export: {
  sheetId: "YOUR_LITURGY_SHEET_ID",  // usually the same liturgy sheet
  gid: "1587228396",                 // the tab whose range you print
  range: "B10:P70",                  // the cells that form the printable order
}
```

The app requests Google's native PDF export of exactly this range (preserving
merged cells, colors, and embedded images), then — on Vercel — crops it tightly
to the content and converts it to a JPG. **This sheet must be publicly
viewable** for the export to work.

---

## 3. Birthdays sheet — `sheets.birthdays`

Drives the **Ulang Tahun** page. The data is spread across **multiple tabs**
(e.g. roughly one per month, though rows are not required to be grouped by
month). All tabs are fetched, merged, and de-duplicated by name.

```ts
birthdays: {
  sheetId: "YOUR_BIRTHDAYS_SHEET_ID",
  tabGids: ["2436171", "244569119", "..."],  // one gid per tab to read
}
```

### Layout expectations (per tab)

Each tab is a simple table. **Row 1 is a header and is skipped.** Columns:

| Column | Index | Meaning | Example |
|--------|-------|---------|---------|
| A | 0 | **Nama** (name, shown as-is) | `Nathanael Lumiu` |
| B | 1 | Tanggal (full date — not parsed) | `02-Februari-2008` |
| C | 2 | **Hari** (day of month, number) | `2` |
| D | 3 | **Bulan** (month name in Indonesian, or a number 1–12) | `Februari` |
| E | 4 | Tahun (year — ignored) | `2008` |

Only **columns A (name)**, **C (day)**, and **D (month)** are used. The **birth
year is ignored** — the page shows only name and date, never age. Month names
are matched case-insensitively (`Januari`…`Desember`), and a numeric month
(`1`–`12`) also works.

Only members whose birthday falls within the **current week (Sunday through
Saturday/Sabbath)** are displayed, sorted by date.

> Adding or removing a tab later is just a matter of updating the `tabGids`
> array — no code changes.

---

## Tips

- **Freshness / caching.** Sheet responses are cached in memory for a short time
  (`src/lib/sheetCache.ts`): schedule ~5 min, liturgy ~10 min, birthdays
  ~60 min. Edits appear on the next fetch after the cache expires; to see them
  immediately, **hard-reload** (`Cmd/Ctrl+Shift+R`) or open a new tab.
- If a page shows "Jadwal tidak ditemukan" / "Gagal memuat", check that the
  sheet is shared publicly and that the date-header format matches.
- All parsing keywords are case-insensitive.
