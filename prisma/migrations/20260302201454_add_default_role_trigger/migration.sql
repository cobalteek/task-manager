CREATE OR REPLACE FUNCTION add_default_role_to_user()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
INSERT INTO "UserRole" ("userId", "roleId")
VALUES (NEW.id, 1);
RETURN NEW;
END;
$$;

CREATE TRIGGER trg_add_default_role
  AFTER INSERT ON "User"
  FOR EACH ROW
  EXECUTE FUNCTION add_default_role_to_user();
