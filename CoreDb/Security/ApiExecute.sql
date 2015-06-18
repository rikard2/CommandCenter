CREATE ROLE [ApiExecute]
    AUTHORIZATION [dbo];


GO
EXECUTE sp_addrolemember @rolename = N'ApiExecute', @membername = N'ApiUser';

