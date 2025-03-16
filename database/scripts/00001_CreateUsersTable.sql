IF OBJECT_ID('dbo.USERS', 'U') IS NULL 
BEGIN
	CREATE TABLE dbo.USERS (
	  UserId INT PRIMARY KEY,
	  Username VARCHAR(500) NOT NULL,
	  CreatedDate DATETIME2 NOT NULL CONSTRAINT df_users_createddate DEFAULT SYSUTCDATETIME()
	)
END
GO