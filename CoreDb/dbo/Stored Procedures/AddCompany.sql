CREATE PROC dbo.AddCompany
	@Ticker varchar(10),
	@Csv varchar(max)
AS
BEGIN
	INSERT INTO dbo.Company (Ticker, Csv) VALUES (@Ticker, @Csv)
END