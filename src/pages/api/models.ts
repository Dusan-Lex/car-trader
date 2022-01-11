import { NextApiRequest, NextApiResponse } from "next";
import { getAsString } from "../../utils/getAsString";
import { getModels } from "../../utils/getModels";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let make = getAsString(req.query.make);
  const models = await getModels(make as string);
  res.json(models);
};
export default handler;
