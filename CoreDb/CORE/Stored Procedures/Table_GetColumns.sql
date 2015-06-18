
CREATE PROC [CORE].[Table_GetColumns]
    @Table varchar(max)
AS
BEGIN
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
            WHEN C.name = T.name + 'Id' THEN 'P'
            WHEN C.name = 'DatetimeInsert' THEN 'ID'
            WHEN C.name = 'UserIdInsert' THEN 'IU'
            WHEN C.name = 'DatetimeUpdate' THEN 'UD'
            WHEN C.name = 'UserIdUpdate' THEN 'UU'
            WHEN C.name = 'DatetimeInactivated' THEN 'AD'
            WHEN C.name = 'UserIdInactivated' THEN 'AU'
            ELSE 'N'
        END AS Category
    FROM sys.tables T
    JOIN sys.columns C ON C.object_id = T.object_id
    JOIN sys.types R ON R.system_type_id = C.system_type_id
    WHERE T.object_id = OBJECT_ID(@Table, 'U')
END
