ALTER TABLE "Chat" ADD COLUMN "parentId" uuid;

DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_parentId_Chat_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$; 