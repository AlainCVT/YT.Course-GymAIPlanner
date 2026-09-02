-- CreateEnum
CREATE TYPE "Goal" AS ENUM ('cut', 'bulk', 'recomp', 'strength', 'endurance');
CREATE TYPE "Experience" AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE "Equipment" AS ENUM ('full_gym', 'home', 'dumbbells');
CREATE TYPE "PreferredSplit" AS ENUM ('full_body', 'upper_lower', 'ppl', 'custom');

-- AlterTable
ALTER TABLE "UserProfiles"
    ALTER COLUMN "goal" TYPE "Goal" USING "goal"::"Goal",
    ALTER COLUMN "experience" TYPE "Experience" USING "experience"::"Experience",
    ALTER COLUMN "equipment" TYPE "Equipment" USING "equipment"::"Equipment",
    ALTER COLUMN "preferred_split" TYPE "PreferredSplit" USING "preferred_split"::"PreferredSplit";
