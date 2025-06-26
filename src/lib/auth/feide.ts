import { BASE_URL } from "../constants";
import { Feide } from "./feide-provider";

type FeideUser = {
  user: {
    userid_sec: [];
    userid: string;
    name: string;
    email: string;
    profilephoto: string;
  };
  audience: string;
};

export const feide = new Feide(process.env.FEIDE_CLIENT_ID!, process.env.FEIDE_CLIENT_SECRET!, {
  redirectURI: `${BASE_URL}/auth/feide/callback`,
});

export async function getFeideUser(
  accessToken: string,
): Promise<{ id: string; email: string; name: string }> {
  const feideUser: FeideUser = await fetch("https://auth.dataporten.no/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((r) => r.json());

  return {
    id: feideUser.user.userid,
    email: feideUser.user.email.toLowerCase(),
    name: feideUser.user.name,
  };
}
