CREATE TABLE [dbo].[User] (
    [UserId]              INT           IDENTITY (1, 1) NOT NULL,
    [FirstName]           VARCHAR (50)  NOT NULL,
    [LastName]            VARCHAR (50)  NOT NULL,
    [Email]               VARCHAR (150) NOT NULL,
    [_IsActive]           BIT           NOT NULL,
    [_UserId]             INT           NULL,
    [_VersionNumber]      INT           NULL,
    [_DatetimeInsert]     DATETIME2 (7) NULL,
    [_UserIdInsert]       INT           NULL,
    [_DatetimeUpdate]     DATETIME2 (7) NULL,
    [_UserIdUpdate]       INT           NULL,
    [_DatetimeInactivate] DATETIME2 (7) NULL,
    [_UserIdInactivate]   INT           NULL,
    PRIMARY KEY CLUSTERED ([UserId] ASC),
    FOREIGN KEY ([_UserId]) REFERENCES [dbo].[User] ([UserId]),
    FOREIGN KEY ([_UserIdInactivate]) REFERENCES [dbo].[User] ([UserId]),
    FOREIGN KEY ([_UserIdInsert]) REFERENCES [dbo].[User] ([UserId]),
    FOREIGN KEY ([_UserIdUpdate]) REFERENCES [dbo].[User] ([UserId])
);


GO
CREATE TRIGGER User_Log_Trigger ON "User" AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    -- Validation

    IF EXISTS(SELECT 1 FROM inserted i WHERE i._UserId IS NULL) THROW 1, 'Missing value for column _UserId.', 1

    IF EXISTS(
        SELECT 1
        FROM inserted i
        LEFT JOIN deleted d ON d.UserId = i.UserId
        WHERE NOT EXISTS(
            SELECT i._VersionNumber, i._DatetimeInsert, i._UserIdInsert, i._DatetimeUpdate, i._UserIdUpdate, i._DatetimeInactivate, i._UserIdInactivate INTERSECT
            SELECT d._VersionNumber, d._DatetimeInsert, d._UserIdInsert, d._DatetimeUpdate, d._UserIdUpdate, d._DatetimeInactivate, i._UserIdInactivate
        )
    ) THROW 1, 'The columns following columns should not be changed or given an initial value: _VersionNumber, _DatetimeInsert, _UserIdInsert, _DatetimeUpdate, _UserIdUpdate, _DatetimeInactivate, _UserIdInactivate.', 1

    IF EXISTS(SELECT 1 FROM inserted i WHERE NOT EXISTS(SELECT 1 FROM deleted d WHERE d.UserId = i.UserId) AND i._IsActive <> 1)
        THROW 1, 'New rows cannot be inactive.', 1;

    IF EXISTS(
        SELECT 1
        FROM inserted i
        JOIN deleted d ON d.UserId = i.UserId
        WHERE i._IsActive <> d._IsActive AND NOT EXISTS(
            SELECT i.FirstName, i.LastName, i.Email INTERSECT
            SELECT d.FirstName, d.LastName, d.Email
        )
    ) THROW 1, 'A row cannot be inactivated/activated and edited at the same time.', 1

    -- Keep the log columns updated and reset the _UserId column.

    UPDATE U SET
        U._UserId = NULL,
        U._VersionNumber = ISNULL(i._VersionNumber, 0) + 1,
        U._DatetimeInsert = IIF(X.IsInsert = 1, SYSDATETIME(), i._DatetimeInsert),
        U._UserIdInsert = IIF(X.IsInsert = 1, i._UserId, i._UserIdInsert),
        U._DatetimeUpdate = IIF(X.IsUpdate = 1, SYSDATETIME(), i._DatetimeUpdate),
        U._UserIdUpdate = IIF(X.IsUpdate = 1, i._UserId, i._UserIdUpdate),
        U._DatetimeInactivate = IIF(X.IsInactivate = 1, SYSDATETIME(), i._DatetimeInactivate),
        U._UserIdInactivate = IIF(X.IsInactivate = 1, i._UserId, i._UserIdInactivate)
    FROM inserted i
    LEFT JOIN deleted d ON (d.UserId = i.UserId)
    CROSS APPLY (
        SELECT IIF(d.UserId IS NULL, 1, 0) AS IsInsert,
               IIF(d.UserId IS NOT NULL AND i._IsActive = d._IsActive, 1, 0) AS IsUpdate,
               IIF(d.UserId IS NOT NULL AND i._IsActive = 0 AND d._IsActive = 1, 1, 0) AS IsInactivate,
               IIF(d.UserId IS NOT NULL AND i._IsActive = 1 AND d._IsActive = 0, 1, 0) AS IsActivate
    ) X
    JOIN "User" U ON (U.UserId = i.UserId)

    -- Keep the log table updated

    INSERT User_Log(UserId, _VersionNumber, FirstName, LastName, Email, _IsActive, _Datetime, _UserId)
    SELECT i.UserId, i._VersionNumber, i.FirstName, i.LastName, i.Email, i._IsActive, SYSDATETIME(), i._UserId
    FROM inserted i

    DELETE U_L
    FROM deleted d
    JOIN User_Log U_L ON (U_L.UserId = d.UserId)
    WHERE NOT EXISTS(SELECT 1 FROM inserted i WHERE i.UserId = d.UserId)
END
