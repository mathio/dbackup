import { getFile } from "../utils/get-file.js";

export const removeBackup = async (req, res) => {
  res.json({
    ok: await getFile(req.body.path, async (file) => {
      await file.delete();
      return true;
    }),
  });
};
