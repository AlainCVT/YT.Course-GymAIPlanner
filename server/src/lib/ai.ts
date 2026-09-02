import dotenv from 'dotenv';
import OpenAI from 'openai';

import { TrainingPlanData, UserProfileData } from '@/types';

dotenv.config();

const GOAL_MAP: Record<UserProfileData['goal'], string> = {
  bulk: 'build muscle and gain size',
  cut: 'lose fat and maintain muscle',
  recomp: 'simultaneously lose fat and build muscle',
  strength: 'build maximum strength',
  endurance: 'improve cardiovascular endurance and stamina',
};

const EXPERIENCE_MAP: Record<UserProfileData['experience'], string> = {
  beginner: 'beginner (0-1 years of training experience)',
  intermediate: 'intermediate (1-3 years of training experience)',
  advanced: 'advanced (3+ years of training experience)',
};

const EQUIPMENT_MAP: Record<UserProfileData['equipment'], string> = {
  full_gym: 'full gym access with all equipment',
  home: 'home gym with limited equipment',
  dumbbells: 'only dumbbells available',
};

const PREFERRED_SPLIT_MAP: Record<UserProfileData['preferred_split'], string> = {
  full_body: 'full body workouts',
  upper_lower: 'upper/lower split',
  ppl: 'push/pull/legs split',
  custom: 'best split for their goals',
};

export async function generateTrainingPlan(profile: UserProfileData): Promise<TrainingPlanData> {
  const normalizedProfile: UserProfileData = {
    goal: profile.goal || 'bulk',
    experience: profile.experience || 'intermediate',
    days_per_week: profile.days_per_week || 4,
    session_length: profile.session_length || 60,
    equipment: profile.equipment || 'full_gym',
    preferred_split: profile.preferred_split || 'upper_lower',
    injuries: profile.injuries || null,
  };

  const apiKey = process.env.OPEN_ROUTER_API_KEY;
  const model = process.env.OPEN_ROUTER_AI_MODEL;

  if (!apiKey) {
    throw new Error('OPEN_ROUTER_API_KEY is not set in environment variables.');
  }

  if (!model) {
    throw new Error('OPEN_ROUTER_AI_MODEL is not set in environment variables.');
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`,
      'X-Title': 'GymAI Plan Generator',
    },
  });

  const prompt = buildPrompt(normalizedProfile);

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert fitness trainer and program designer. You must respond with valid JSON only. Do not include any markdown, reasoning, or additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;

    if (!content) {
      console.error('[AI] No content in response:', JSON.stringify(completion, null, 2));
      throw new Error('No content in AI response.');
    }

    const aiResponse = JSON.parse(content) as DeepPartial<TrainingPlanData>;

    const normalizedPlan: TrainingPlanData = {
      overview: {
        goal: aiResponse.overview?.goal || `Customized ${profile.goal} program`,
        frequency: aiResponse.overview?.frequency || `${profile.days_per_week} days per week`,
        split: aiResponse.overview?.split || profile.preferred_split,
        notes: aiResponse.overview?.notes || 'Follow the program consistently for best results.',
      },
      weeklySchedule: (aiResponse.weeklySchedule || []).map((schedule) => ({
        day: schedule?.day || 'Day',
        focus: schedule?.focus || 'Full Body',
        exercises: (schedule?.exercises || []).map((exercise) => ({
          name: exercise?.name || 'Exercise',
          sets: exercise?.sets || 3,
          reps: exercise?.reps || '8-12',
          rest: exercise?.rest || '60-90 sec',
          rpe: exercise?.rpe || 7,
          notes: exercise?.notes,
          alternatives: exercise?.alternatives,
        })),
      })),
      progression:
        aiResponse.progression ||
        'Increase weight by 1kg or 2kg when you can complete all sets with good form. Track your progress weekly.',
    };

    return normalizedPlan;
  } catch (error) {
    console.error('[AI] Error generating training plan:', error);
    throw error;
  }
}

const buildPrompt = (profile: UserProfileData): string =>
  `
Create a personalized ${profile.days_per_week}-day per week training plan for someone with the following profile:

Goal: ${GOAL_MAP[profile.goal] || profile.goal}
Experience Level: ${EXPERIENCE_MAP[profile.experience] || profile.experience}
Session Length: ${profile.session_length} minutes per session
Equipment: ${EQUIPMENT_MAP[profile.equipment] || profile.equipment}
Preferred Split: ${PREFERRED_SPLIT_MAP[profile.preferred_split] || profile.preferred_split}
Injuries/Limitations: ${profile.injuries ? `${profile.injuries}` : 'none'}

Generate a complete training plan in JSON format with this exact structure:
{
  "overview": {
    "goal": "brief description of the training goal",
    "frequency": "X days per week",
    "split": "training split name",
    "notes": "important notes about the program (2-3 sentences)"
  },
  "weeklySchedule": [
    {
      "day": "Monday",
      "focus": "muscle group or focus area",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 4,
          "reps": "6-8",
          "rest": "2-3 min",
          "rpe": 8,
          "notes": "form cues or tips (optional)",
          "alternatives": ["Alternative 1", "Alternative 2"]
        }
      ]
    }
  ],
  "progression": "detailed progression strategy (2-3 sentences explaining how to progress)"
}

Requirements:
- Create exactly ${profile.days_per_week} workout days
- Each workout should fit within ${profile.session_length} minutes
- Include 4-6 exercises per workout
- RPE (Rate of Perceived Exertion) should be 6-9
- Include compound movements for beginners/intermediate, advanced can have more isolation
- Match the preferred split type: ${PREFERRED_SPLIT_MAP[profile.preferred_split] || profile.preferred_split}
- ${profile.injuries ? `Avoid exercises that could aggravate: ${profile.injuries}` : 'No injuries'}
- Provide exercise alternatives where appropriate
- Make it progressive and suitable for ${EXPERIENCE_MAP[profile.experience] || profile.experience} level

Return ONLY the JSON object (no markdown, no extra text).
`.trim();
