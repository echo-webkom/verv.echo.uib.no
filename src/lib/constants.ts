import { fromZonedTime } from "date-fns-tz";

import { groupEnum, studyEnum, yearEnum } from "./db/schemas";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? (process.env.BASE_URL ?? "https://verv.echo.uib.no")
    : `http://localhost:${process.env.PORT ?? 3000}`;

export type Year = (typeof yearEnum)[number];
export type Study = (typeof studyEnum)[number];
export type Group = (typeof groupEnum)[number];

export const APPLICATION_DEADLINE = fromZonedTime("2026-01-31 23:59:59", "Europe/Oslo");

export const yearNames = {
  1: "1. året",
  2: "2. året",
  3: "3. året",
  4: "4. året",
  5: "5. året",
} as const satisfies Record<Year, string>;

export const studyNames = {
  DTEK: "Datateknologi",
  DSIK: "Datasikkerhet",
  DVIT: "Datavitenskap",
  BINF: "Bioinformatikk",
  IMO: "Informatikk-matematikk-økonomi",
  INF: "Master i Informatikk",
  PROG: "Felles master i programvareutvikling",
  DSC: "Master i Data Science",
  OTHER: "Annet (ikke på listen)",
} as const satisfies Record<Study, string>;

export const groupNames = {
  webkom: "Webkom",
  tilde: "Tilde",
  bedkom: "Bedkom",
  hyggkom: "Hyggkom",
  gnist: "Gnist",
  esc: "echo Sports Club",
  programmerbar: "Programmerbar",
  consulting: "echo Consulting",
} as const satisfies Record<Group, string>;
