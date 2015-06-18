
CREATE PROC [APIDEBUG].[Person_Set]
	@_ErrorMessage varchar(max) OUTPUT,
	@_UserId int = NULL,

	@PersonId int = NULL OUTPUT,

	@FirstName varchar(max),
	@LastName varchar(max)
AS
BEGIN

	/*SELECT
		@_ErrorMessage = 'Något gick fel'
	RETURN -1
	*/

	IF @PersonId IS NULL
	BEGIN
		INSERT INTO dbo.Person
		(
			FirstName,
			LastName,
			DatetimeInsert
		)
		VALUES
		(
			@FirstName,
			@LastName,
			SYSDATETIME()
		)

		SELECT
			@PersonId = SCOPE_IDENTITY()

		RETURN 0
	END
	ELSE
	BEGIN
		UPDATE
			P
		SET
			FirstName = @FirstName,
			LastName = @LastName,
			DatetimeUpdate = SYSDATETIME()
		FROM
			dbo.Person P
		WHERE
			P.PersonId = @PersonId

	END

	RETURN 0
END
