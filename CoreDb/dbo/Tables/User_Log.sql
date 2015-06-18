CREATE TABLE [dbo].[User_Log] (
    [UserId]         INT           NOT NULL,
    [_VersionNumber] INT           NOT NULL,
    [FirstName]      VARCHAR (50)  NOT NULL,
    [LastName]       VARCHAR (50)  NOT NULL,
    [Email]          VARCHAR (150) NOT NULL,
    [_IsActive]      BIT           DEFAULT ((1)) NOT NULL,
    [_Datetime]      DATETIME2 (7) NOT NULL,
    [_UserId]        INT           NOT NULL,
    PRIMARY KEY CLUSTERED ([UserId] ASC, [_VersionNumber] ASC),
    FOREIGN KEY ([_UserId]) REFERENCES [dbo].[User] ([UserId]),
    FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([UserId])
);

