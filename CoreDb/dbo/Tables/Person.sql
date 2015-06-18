CREATE TABLE [dbo].[Person] (
    [PersonId]       INT           IDENTITY (1, 1) NOT NULL,
    [FirstName]      VARCHAR (MAX) NULL,
    [LastName]       VARCHAR (MAX) NULL,
    [DatetimeInsert] DATETIME2 (2) NOT NULL,
    [DatetimeUpdate] DATETIME2 (2) NULL,
    PRIMARY KEY CLUSTERED ([PersonId] ASC)
);

