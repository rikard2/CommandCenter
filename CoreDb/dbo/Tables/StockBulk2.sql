CREATE TABLE [dbo].[StockBulk2] (
    [id]       INT          IDENTITY (1, 1) NOT NULL,
    [ticker]   VARCHAR (10) NULL,
    [date]     DATE         NULL,
    [Open]     MONEY        NULL,
    [High]     MONEY        NULL,
    [Low]      MONEY        NULL,
    [Close]    MONEY        NULL,
    [Volume]   INT          NULL,
    [AdjClose] MONEY        NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

