CREATE FUNCTION Dev.Table_GetColumns(@object_id_table int) RETURNS TABLE
AS
RETURN
	SELECT
		ROW_NUMBER() OVER (
			ORDER BY CASE X.Category
				WHEN 'N' THEN 1
				WHEN 'ID' THEN 2
				WHEN 'IU' THEN 3
				WHEN 'UD' THEN 4
				WHEN 'UU' THEN 5
				WHEN 'AD' THEN 6
				WHEN 'AU' THEN 7
			END,
			X.column_id
		) AS Number,
		X.Name,
		X.Category
	FROM (
	    SELECT
	        C.column_id,
	        C.name AS Name,
	        R.name +
	        CASE
	            WHEN R.name = 'int' THEN ''
	            WHEN R.name = 'bit' THEN ''
	            WHEN R.name = 'varchar' AND C.max_length <> -1 THEN '(' + CAST(C.max_length AS varchar(max)) + ')'
	            WHEN R.name = 'varchar' AND C.max_length = -1 THEN '(max)'
	            WHEN R.name = 'datetime2' AND C.scale = 7 THEN ''
	        END AS TypeName,
	        CASE
	            WHEN C.name = 'DatetimeInsert' THEN 'ID'
	            WHEN C.name = 'UserIdInsert' THEN 'IU'
	            WHEN C.name = 'DatetimeUpdate' THEN 'UD'
	            WHEN C.name = 'UserIdUpdate' THEN 'UU'
	            WHEN C.name = 'DatetimeInactivated' THEN 'AD'
	            WHEN C.name = 'UserIdInactivated' THEN 'AU'
	            ELSE 'N'
	        END AS Category
	    FROM sys.columns C
	    JOIN sys.types R ON (R.system_type_id = C.system_type_id)
	    WHERE C.object_id = @object_id_table
	) X
