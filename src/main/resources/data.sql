
merge into Technology(ID, NAME) KEY(ID)
select 1, 'Shell Script' from dual;

merge into Technology(ID, NAME) KEY(ID)
select 2, 'Database' from dual;

-- merge into Technology(ID, NAME) KEY(ID)
-- select 3, 'Python' from dual;

-- merge into Technology(ID, NAME) KEY(ID)
-- select 4, 'Ruby' from dual;

-- merge into Technology(ID, NAME) KEY(ID)
-- select 5, 'NodeJS' from dual;

-- merge into Technology(ID, NAME) KEY(ID)
-- select 6, 'Scala' from dual;

merge into Settings(ID, NAME, VALUE) KEY(ID)
select 1, 'MAX_PARALLEL', 64 from dual;
