CREATE TABLE [dbo].[Company] (
    [CompanyId]        INT           IDENTITY (1, 1) NOT NULL,
    [Ticker]           VARCHAR (10)  NOT NULL,
    [Csv]              VARCHAR (MAX) NULL,
    [ImportedDatetime] DATETIME      NULL,
    PRIMARY KEY CLUSTERED ([CompanyId] ASC)
);

