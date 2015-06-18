CREATE PROC [APIDEBUG].[Person_Get]
	@_ErrorMessage varchar(max) OUTPUT,
	@_UserId int = NULL,

	@PersonId int
AS
BEGIN

	SELECT
		P.FirstName,
		P.LastName
	FROM
		dbo.Person P
	WHERE
		P.PersonId = @PersonID
	UNION ALL
	SELECT
		NULL AS FirstName,
		NULL AS LastName
	WHERE
		@PersonId IS NULL

	RETURN 0
END
