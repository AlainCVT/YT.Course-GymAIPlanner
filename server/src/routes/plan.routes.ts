import { Router } from 'express';

import { Prisma } from '@/generated/prisma/client';
import { generateTrainingPlan } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { validateMiddleware } from '@/middlewares/validate.middleware';
import { TrainingPlanData } from '@/types';
import { UserData, userData } from '@/validators/user-profiles.validator';

export const planRouter = Router();

planRouter.post('/generate', validateMiddleware(userData), async (req, res) => {
  try {
    const { userId } = req.body as UserData;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const profile = await prisma.userProfiles.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      return res.status(400).json({ error: 'User profile not found. Complete onboarding first.' });
    }

    const latestPlan = await prisma.trainingPlans.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      select: { version: true },
    });

    const nextVersion = latestPlan ? latestPlan.version + 1 : 1;

    let planJson: TrainingPlanData;

    try {
      planJson = await generateTrainingPlan(profile);
    } catch (error) {
      console.error('AI generation failed:', error);
      return res.status(500).json({
        error: 'Failed to generate training plan. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    const newPlan = await prisma.trainingPlans.create({
      data: {
        user_id: userId,
        plan_json: planJson as Prisma.InputJsonValue & TrainingPlanData,
        plan_text: JSON.stringify(planJson, null, 2),
        version: nextVersion,
      },
    });

    res.json({
      success: true,
      id: newPlan.id,
      version: newPlan.version,
      createdAt: newPlan.created_at,
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).json({ error: 'Failed to generate plan.' });
  }
});

planRouter.get('/current', async (req, res) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    const plan = await prisma.trainingPlans.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    if (!plan) {
      return res.status(404).json({ error: 'No plan found.' });
    }

    res.json({
      id: plan.id,
      userId: plan.user_id,
      planJson: plan.plan_json,
      planText: plan.plan_text,
      version: plan.version,
      createdAt: plan.created_at,
    });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ error: 'Failed to fetch plan.' });
  }
});
