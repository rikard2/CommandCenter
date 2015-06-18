

CREATE PROC [CORE].[GetStoredProcedureParameters]
	@Schema varchar(max) = 'dbo',
	@Name varchar(max)
AS
BEGIN
	SELECT
		SP.name AS StoredProcedureName,
		RIGHT(P.name, LEN(P.name) - 1) AS ParameterName,
		T.system_type_id,
		T.name AS TypeName,
		P.is_nullable AS IsNullable,
		P.default_value,
		P.is_output AS IsOutput,
		P.max_length,
		P.precision,
		P.scale
	FROM
		sys.procedures SP
		JOIN sys.parameters P ON
			SP.object_id = P.object_id
		JOIN sys.types T ON
			T.system_type_id = P.system_type_id
	WHERE
		SP.Name = @Name
END


