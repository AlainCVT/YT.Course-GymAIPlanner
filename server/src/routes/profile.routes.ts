import { Router } from 'express';

import { prisma } from '@/lib/prisma';
import { validateMiddleware } from '@/middlewares/validate.middleware';
import { UserProfilesRequest, userProfilesSchema } from '@/validators/user-profiles.validator';

export const profileRouter = Router();

profileRouter.post('/', validateMiddleware(userProfilesSchema), async (req, res) => {
  try {
    const {
      userId,
      goal,
      experience,
      daysPerWeek,
      sessionLength,
      equipment,
      preferredSplit,
      injuries,
    } = req.body as UserProfilesRequest;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!goal || !experience || !daysPerWeek || !sessionLength || !equipment || !preferredSplit) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await prisma.userProfiles.upsert({
      where: { user_id: userId },
      update: {
        goal,
        experience,
        days_per_week: daysPerWeek,
        session_length: sessionLength,
        equipment,
        injuries: injuries || null,
        preferred_split: preferredSplit,
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        goal,
        experience,
        days_per_week: daysPerWeek,
        session_length: sessionLength,
        equipment,
        injuries: injuries || null,
        preferred_split: preferredSplit,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});
