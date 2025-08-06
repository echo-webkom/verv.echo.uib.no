import { getCloudflareContext } from "@opennextjs/cloudflare";

import { Group } from "./constants";
import { groupEnum } from "./db/schemas";

const isValidGroup = (group: string): group is Group => {
  return groupEnum.includes(group as Group);
};

export const getEchoGroups = async (feideId: string) => {
  const context = await getCloudflareContext({ async: true });
  const { ADMIN_KEY, GROUPS_API_URL } = context.env;

  if (!GROUPS_API_URL || !ADMIN_KEY) {
    return [];
  }

  const fetchUrl = new URL(GROUPS_API_URL);
  fetchUrl.searchParams.set("feideId", feideId);

  const response = await fetch(fetchUrl, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_KEY}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const groups = (await response.json()) as Array<string>;

  const filteredGroups = groups.filter(isValidGroup);

  return filteredGroups;
};
