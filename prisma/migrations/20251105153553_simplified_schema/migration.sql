-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('run', 'bike', 'swim');

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "photo_url" TEXT,
    "goal_rep" INTEGER NOT NULL DEFAULT 100,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "discord_webhook_url" TEXT,
    "discord_invite_url" TEXT,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "owner_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "group_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "records" (
    "id" SERIAL NOT NULL,
    "exercise_type" "ExerciseType" NOT NULL,
    "description" TEXT,
    "time" INTEGER NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "group_id" INTEGER NOT NULL,
    "author_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "participants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
