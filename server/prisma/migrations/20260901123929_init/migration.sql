-- CreateTable
CREATE TABLE "UserProfiles" (
    "user_id" UUID NOT NULL,
    "goal" VARCHAR(20) NOT NULL,
    "experience" VARCHAR(20) NOT NULL,
    "days_per_week" INTEGER NOT NULL,
    "session_length" INTEGER NOT NULL,
    "equipment" VARCHAR(20) NOT NULL,
    "preferred_split" VARCHAR(20) NOT NULL,
    "injuries" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProfiles_pkey" PRIMARY KEY ("user_id")
);
