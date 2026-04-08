import { Group } from "./constants";
import { groupEnum } from "./db/schemas";

const url = process.env.UNO_BASE_URL;

type GroupResponse = {
  name: string;
  id: string;
  isLeader: boolean;
};

// Partial user response from echo
type UserResponse = {
  groups: GroupResponse[];
};

const isValidGroup = (group: string): group is Group => {
  return groupEnum.includes(group as Group);
};

export const getEchoGroups = async (feideId: string) => {
  if (!url) {
    return [];
  }

  const response = await fetch(`${url}/users/${feideId}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Key": `${process.env.ADMIN_KEY}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const user = (await response.json()) as UserResponse;

  const filteredGroups = user.groups
    .filter((group) => isValidGroup(group.id))
    .map((group) => group.id as Group);

  return filteredGroups;
};
