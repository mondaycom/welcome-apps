import { Request, Response } from 'express';
import { secureStorageDelete } from '../utils/secure-storage';

const handleUninstall = async (req: Request, res: Response) => {
  const { accountId } = req.session;
  try {
    // Add your logic here
    await secureStorageDelete(`${accountId}-token`);
    res.json({ message: 'Uninstall Event handled' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export { handleUninstall };
