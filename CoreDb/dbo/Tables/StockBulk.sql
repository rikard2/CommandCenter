CREATE TABLE [dbo].[StockBulk] (
    [id]       INT           IDENTITY (1, 1) NOT NULL,
    [ticker]   VARCHAR (MAX) NULL,
    [date]     VARCHAR (MAX) NULL,
    [Open]     VARCHAR (MAX) NULL,
    [High]     VARCHAR (MAX) NULL,
    [Low]      VARCHAR (MAX) NULL,
    [Close]    VARCHAR (MAX) NULL,
    [Volume]   VARCHAR (MAX) NULL,
    [AdjClose] VARCHAR (MAX) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

